"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import MapModal from "@/components/MapModal";
import AllLocationsModal from "@/components/AllLocationsModal";
import CalendarModal from "@/components/CalendarModal";

interface Activity {
    id?: number;
    title: string;
    description?: string;
    address?: string;
    labels: string[];
    picture?: string;
    ayoubRating: number;
    medinaRating: number;
    date: string;
    moment?: string;
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [notification, setNotification] = useState<string | null>(null);

    // Load activities from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('activities');
        if (stored) {
            setActivities(JSON.parse(stored));
        }
    }, []);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [labels, setLabels] = useState<string[]>([]);
    const [picture, setPicture] = useState("");
    const [date, setDate] = useState("");
    const [ayoubRating, setAyoubRating] = useState(5);
    const [medinaRating, setMedinaRating] = useState(5);
    const [moment, setMoment] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');
    const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [mapAddress, setMapAddress] = useState('');
    const [activityBeforeMap, setActivityBeforeMap] = useState<Activity | null>(null);
    const [showAllMap, setShowAllMap] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [cameFromCalendar, setCameFromCalendar] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sortType, setSortType] = useState<'date' | 'rating'>('date');
    const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

    // Generate star rating based on score out of 10 (scaled to 5 stars)
    const getStarRating = (rating: number) => {
        const stars = Math.round(rating / 2); // Convert 10-point scale to 5-star scale
        return '⭐'.repeat(stars);
    };

    // Check authentication on mount
    useEffect(() => {
        const auth = localStorage.getItem('authenticated');
        const user = localStorage.getItem('currentUser');
        setIsAuthenticated(auth === 'true');
        setCurrentUser(user);
    }, []);

    // Cute messages for notifications
    const cuteMessages = [
        "New adventure added! 🎆",
        "Another memory in the making! 🌈", 
        "Your activity list is growing! 🌱",
        "Ready for some fun? 🎉",
        "New plan unlocked! 🔓",
        "Adventure awaits! ✨"
    ];

    // Different gradient colors for notifications
    const notificationColors = [
        'bg-gradient-to-r from-pink-500 to-rose-500',
        'bg-gradient-to-r from-purple-500 to-indigo-500', 
        'bg-gradient-to-r from-blue-500 to-cyan-500',
        'bg-gradient-to-r from-green-500 to-emerald-500',
        'bg-gradient-to-r from-yellow-500 to-orange-500',
        'bg-gradient-to-r from-red-500 to-pink-500'
    ];

    const showNotification = (message: string, colorClass: string) => {
        setNotification(`${message}|${colorClass}`);
        setTimeout(() => setNotification(null), 3000);
    };

    // Reset all form fields
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setAddress("");
        setLabels([]);
        setPicture("");
        setDate("");
        setAyoubRating(5);
        setMedinaRating(5);
        setMoment("");
    };

    const handleAdd = async () => {
        if (!title.trim() || !date) return;
        
        if (editingActivity) {
            // Update existing activity
            const updatedActivities = activities.map(act => 
                act.id === editingActivity.id 
                    ? { ...editingActivity, title, description, address, labels, picture, ayoubRating, medinaRating, date }
                    : act
            );
            setActivities(updatedActivities);
            localStorage.setItem('activities', JSON.stringify(updatedActivities));
        } else {
            // Create new activity
            const newActivity = {
                id: Date.now(),
                title,
                description,
                address,
                labels,
                picture,
                ayoubRating,
                medinaRating,
                date
            };
            const updatedActivities = [newActivity, ...activities];
            setActivities(updatedActivities);
            localStorage.setItem('activities', JSON.stringify(updatedActivities));
        }
        
        resetForm();
        setDialogOpen(false);
        setEditingActivity(null);
    };

    const handleEdit = (activity: Activity) => {
        setEditingActivity(activity);
        setTitle(activity.title || '');
        setDescription(activity.description || '');
        setAddress(activity.address || '');
        setLabels(activity.labels || []);
        setPicture(activity.picture || '');
        setDate(activity.date || '2024-09-17');
        setAyoubRating(activity.ayoubRating || 5);
        setMedinaRating(activity.medinaRating || 5);
        setMoment(activity.moment || '');
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;
        
        const updatedActivities = activities.filter(act => act.id !== id);
        setActivities(updatedActivities);
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
    };

    return (
        <main className="min-h-screen p-6 relative">
            {/* Galaxy background elements */}
            <div className="planet-1"></div>
            <div className="planet-2"></div>
            
            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.split('|')[1]}`}>
                    {notification.split('|')[0]}
                </div>
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="galaxy-title">Moments</h1>
                    
                    {!isAuthenticated ? (
                        <div className="login-section">
                            <button 
                                className="login-btn ayoub-btn"
                                onClick={() => {
                                    localStorage.setItem('authenticated', 'true');
                                    localStorage.setItem('currentUser', 'Ayoub');
                                    setIsAuthenticated(true);
                                    setCurrentUser('Ayoub');
                                }}
                            >
                                Login as Ayoub
                            </button>
                            <button 
                                className="login-btn medina-btn"
                                onClick={() => {
                                    localStorage.setItem('authenticated', 'true');
                                    localStorage.setItem('currentUser', 'Medina');
                                    setIsAuthenticated(true);
                                    setCurrentUser('Medina');
                                }}
                            >
                                Login as Medina
                            </button>
                        </div>
                    ) : (
                        <div className="user-info">
                            <span className="welcome-text">Welcome, {currentUser}! ✨</span>
                            <button 
                                className="logout-btn"
                                onClick={() => {
                                    localStorage.removeItem('authenticated');
                                    localStorage.removeItem('currentUser');
                                    setIsAuthenticated(false);
                                    setCurrentUser(null);
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 mb-8 justify-center">
                    <Dialog
                        open={dialogOpen}
                        onOpenChange={(open: boolean) => {
                            setDialogOpen(open);
                            if (!open) {
                                resetForm();
                                setEditingActivity(null);
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <button className="add-activity-bubble">✨ Add Activity</button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add New Activity'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium">Title</label>
                                    <input
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70"
                                        placeholder="Activity name..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium">Description</label>
                                    <textarea
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70"
                                        placeholder="Optional details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium">Address</label>
                                    <input
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70"
                                        placeholder="Location..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium">Labels</label>
                                    <input
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-white/70"
                                        placeholder="Comma-separated tags..."
                                        value={labels.join(", ")}
                                        onChange={(e) => setLabels(e.target.value.split(",").map(l => l.trim()))}
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium">Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-medium">Ayoub Rating (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white"
                                            value={ayoubRating}
                                            onChange={(e) => setAyoubRating(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-medium">Medina Rating (1-10)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="w-full p-3 rounded-lg bg-white/10 border border-white/30 text-white"
                                            value={medinaRating}
                                            onChange={(e) => setMedinaRating(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleAdd}
                                    className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg font-medium transition-all"
                                >
                                    {editingActivity ? 'Update Activity' : 'Add Activity'}
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <button 
                        className="rate-bubble"
                        onClick={() => window.location.href = '/rate'}
                    >
                        🎯 Rate Activities
                    </button>

                    <button 
                        className="calendar-bubble"
                        onClick={() => setShowCalendar(true)}
                    >
                        📅 Calendar View
                    </button>

                    <button 
                        className="map-all-bubble"
                        onClick={() => setShowAllMap(true)}
                    >
                        🗺️ Map All Locations
                    </button>

                    <select 
                        className="filter-bubble"
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                    >
                        <option value="all">All Activities</option>
                        {Array.from(new Set(activities.flatMap(act => act.labels))).map(label => (
                            <option key={label} value={label}>{label}</option>
                        ))}
                    </select>

                    <div className="sort-container">
                        <select 
                            className="sort-type-selector"
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value as 'date' | 'rating')}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="rating">Sort by Rating</option>
                        </select>
                        <button 
                            className={`sort-bubble ${sortOrder === 'asc' ? 'active' : ''}`}
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'none' : 'asc')}
                        >
                            ↑
                        </button>
                        <button 
                            className={`sort-bubble ${sortOrder === 'desc' ? 'active' : ''}`}
                            onClick={() => setSortOrder(sortOrder === 'desc' ? 'none' : 'desc')}
                        >
                            ↓
                        </button>
                    </div>
                </div>



                {/* Activities Display */}
                <div className="bubble-container">
                    {activities
                        .filter(act => selectedFilter === 'all' || act.labels.includes(selectedFilter))
                        .sort((a, b) => {
                            if (sortOrder === 'none') return 0;
                            
                            let comparison = 0;
                            if (sortType === 'date') {
                                const dateA = new Date(a.date || '1970-01-01');
                                const dateB = new Date(b.date || '1970-01-01');
                                comparison = dateA.getTime() - dateB.getTime();
                            } else {
                                const avgA = (a.ayoubRating + a.medinaRating) / 2;
                                const avgB = (b.ayoubRating + b.medinaRating) / 2;
                                comparison = avgA - avgB;
                            }
                            
                            return sortOrder === 'asc' ? comparison : -comparison;
                        })
                        .map((act, idx) => {
                            const bubbleColors = [
                                'bubble-pink', 'bubble-blue', 'bubble-green', 
                                'bubble-purple', 'bubble-orange', 'bubble-cyan', 'bubble-gray'
                            ];
                            const bubbleClass = bubbleColors[idx % bubbleColors.length];
                            
                            const activityDate = act.date ? new Date(act.date) : null;
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isPast = activityDate && activityDate < today;
                            
                            return (
                                <div key={act.id || idx} className={`activity-bubble ${bubbleClass} ${isPast ? 'past' : ''}`}>
                                    <div className="bubble-content">
                                        <div className="bubble-title">{act.title}</div>
                                        <div className="bubble-date">{act.date || 'No date set'}</div>
                                        {act.description && <div className="bubble-desc">{act.description}</div>}
                                        {act.address && <div className="bubble-location">📍 {act.address}</div>}
                                        {act.labels.length > 0 && <div className="bubble-labels">🏷️ {act.labels.join(', ')}</div>}
                                        <div className="bubble-rating">
                                            ⭐ {((act.ayoubRating + act.medinaRating) / 2).toFixed(1)}/10
                                        </div>
                                    </div>
                                    <div className="bubble-actions">
                                        <button 
                                            className="bubble-btn"
                                            onClick={() => handleEdit(act)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            className="bubble-btn"
                                            onClick={() => handleDelete(act.id!)}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                        {act.address && (
                                            <button 
                                                className="bubble-btn"
                                                onClick={() => {
                                                    setMapAddress(act.address!);
                                                    setShowMap(true);
                                                }}
                                                title="View on Map"
                                            >
                                                🗺️
                                            </button>
                                        )}
                                        <button 
                                            className="bubble-btn"
                                            onClick={() => setViewingActivity(act)}
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    }
                }

                {/* Modals */}
                {showMap && (
                    <MapModal 
                        address={mapAddress}
                        onClose={() => setShowMap(false)}
                    />
                )}

                {showAllMap && (
                    <AllLocationsModal 
                        activities={activities}
                        onClose={() => setShowAllMap(false)}
                    />
                )}

                {showCalendar && (
                    <CalendarModal 
                        activities={activities}
                        onClose={() => setShowCalendar(false)}
                        onActivityClick={(activity) => {
                            setViewingActivity(activity);
                            setShowCalendar(false);
                            setCameFromCalendar(true);
                        }}
                    />
                )}

                {viewingActivity && (
                    <div className="moment-modal-overlay" onClick={() => setViewingActivity(null)}>
                        <div className="moment-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="moment-close" onClick={() => setViewingActivity(null)}>×</button>
                            <h2 className="moment-title">{viewingActivity.title}</h2>
                            
                            <div className="moment-details">
                                <div className="detail-item">
                                    <span className="detail-label">Date:</span>
                                    <span className="detail-value">{viewingActivity.date || 'Not set'}</span>
                                </div>
                                {viewingActivity.address && (
                                    <div className="detail-item">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value clickable-address" 
                                              onClick={() => {
                                                  setMapAddress(viewingActivity.address!);
                                                  setShowMap(true);
                                                  setActivityBeforeMap(viewingActivity);
                                                  setViewingActivity(null);
                                              }}>
                                            {viewingActivity.address}
                                        </span>
                                    </div>
                                )}
                                {viewingActivity.labels.length > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">Tags:</span>
                                        <span className="detail-value">{viewingActivity.labels.join(', ')}</span>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <span className="detail-label">Ayoub's Rating:</span>
                                    <span className="detail-value">{viewingActivity.ayoubRating}/10 {getStarRating(viewingActivity.ayoubRating)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Medina's Rating:</span>
                                    <span className="detail-value">{viewingActivity.medinaRating}/10 {getStarRating(viewingActivity.medinaRating)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Average:</span>
                                    <span className="detail-value">{((viewingActivity.ayoubRating + viewingActivity.medinaRating) / 2).toFixed(1)}/10</span>
                                </div>
                            </div>

                            {viewingActivity.description && (
                                <div className="moment-description">
                                    <h3 className="story-header">Description</h3>
                                    <p className="story-text">{viewingActivity.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </main>
    );
}