"use client";

import { useState } from 'react';

interface Activity {
  id?: number;
  title: string;
  date: string;
  rating: number;
  labels: string[];
}

interface CalendarModalProps {
  activities: Activity[];
  onClose: () => void;
  onActivitySelect: (activity: Activity) => void;
}

export default function CalendarModal({ activities, onClose, onActivitySelect }: CalendarModalProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getActivitiesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activities.filter(act => act.date === dateStr);
  };

  const changeMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(currentDate.getDate() - day);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayActivities = activities.filter(act => act.date === date.toISOString().split('T')[0]);
      const isToday = new Date().toDateString() === date.toDateString();
      
      weekDays.push(
        <div key={i} className={`calendar-day week-day ${isToday ? 'today' : ''}`}>
          <div className="day-number">{date.getDate()}</div>
          <div className="day-month">{monthNames[date.getMonth()].slice(0, 3)}</div>
          <div className="day-activities">
            {dayActivities.map((activity, idx) => (
              <div 
                key={idx} 
                className="activity-item clickable" 
                title={activity.title}
                onClick={() => onActivitySelect(activity)}
              >
                <span className="activity-title">{activity.title}</span>
                <span className="activity-emoji">{getActivityEmoji(activity)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return weekDays;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const changeWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const getActivityEmoji = (activity: Activity) => {
    const title = activity.title.toLowerCase();
    const labels = activity.labels.map(l => l.toLowerCase());
    
    // Check labels first
    if (labels.includes('food') || labels.includes('restaurant') || labels.includes('dinner')) return '🍽️';
    if (labels.includes('movie') || labels.includes('cinema') || labels.includes('film')) return '🎬';
    if (labels.includes('outdoors') || labels.includes('nature') || labels.includes('hiking')) return '🌲';
    if (labels.includes('sport') || labels.includes('gym') || labels.includes('fitness')) return '⚽';
    if (labels.includes('travel') || labels.includes('vacation') || labels.includes('trip')) return '✈️';
    if (labels.includes('shopping') || labels.includes('mall')) return '🛍️';
    if (labels.includes('music') || labels.includes('concert') || labels.includes('party')) return '🎵';
    if (labels.includes('work') || labels.includes('meeting') || labels.includes('office')) return '💼';
    if (labels.includes('beach') || labels.includes('swimming') || labels.includes('pool')) return '🏖️';
    if (labels.includes('art') || labels.includes('museum') || labels.includes('gallery')) return '🎨';
    
    // Check title keywords
    if (title.includes('eat') || title.includes('lunch') || title.includes('dinner') || title.includes('breakfast')) return '🍽️';
    if (title.includes('movie') || title.includes('film') || title.includes('cinema')) return '🎬';
    if (title.includes('walk') || title.includes('hike') || title.includes('park')) return '🚶';
    if (title.includes('coffee') || title.includes('café')) return '☕';
    if (title.includes('birthday') || title.includes('celebration')) return '🎉';
    if (title.includes('date') || title.includes('romantic')) return '💕';
    if (title.includes('game') || title.includes('play')) return '🎮';
    if (title.includes('book') || title.includes('read')) return '📚';
    if (title.includes('drive') || title.includes('car')) return '🚗';
    if (title.includes('home') || title.includes('house')) return '🏠';
    
    // Default emoji
    return '📅';
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayActivities = getActivitiesForDate(day);
    const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    days.push(
      <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
        <div className="day-number">{day}</div>
        <div className="day-activities">
          {dayActivities.map((activity, idx) => (
            <div 
              key={idx} 
              className="activity-dot clickable" 
              title={activity.title}
              onClick={() => onActivitySelect(activity)}
            >
              {getActivityEmoji(activity)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
        <button className="calendar-close" onClick={onClose}>✕</button>
        
        <div className="calendar-header">
          <button className="nav-btn" onClick={() => viewMode === 'month' ? changeMonth(-1) : changeWeek(-1)}>‹</button>
          <div className="calendar-title-section">
            <h3 className="calendar-title">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="view-selector">
              <button 
                className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Month
              </button>
              <button 
                className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Week
              </button>
            </div>
          </div>
          <button className="nav-btn" onClick={() => viewMode === 'month' ? changeMonth(1) : changeWeek(1)}>›</button>
        </div>

        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className={`calendar-grid ${viewMode}`}>
          {viewMode === 'month' ? days : getWeekDays()}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">🍽️ Food 🎬 Movies 🌲 Outdoors ⚽ Sports</div>
          <div className="legend-item">🔵 Today</div>
        </div>
      </div>
    </div>
  );
}