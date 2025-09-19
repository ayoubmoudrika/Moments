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

    // Load activities from database
    useEffect(() => {
        fetch('/api/activities')
            .then(res => res.json())
            .then(setActivities)
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
            const response = await fetch('/api/activities', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingActivity.id, title, description, address, labels, picture, ayoubRating, medinaRating, date, moment })
            });
            
            const updatedActivity = await response.json();
            setActivities(activities.map(act => act.id === editingActivity.id ? updatedActivity : act));
        } else {
            // Create new activity
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, address, labels, picture, ayoubRating, medinaRating, date, moment })
            });
            
            const newActivity = await response.json();
            setActivities([newActivity, ...activities]);
            
            // Show cute notification
            const randomMessage = cuteMessages[Math.floor(Math.random() * cuteMessages.length)];
            const randomColor = notificationColors[Math.floor(Math.random() * notificationColors.length)];
            showNotification(randomMessage, randomColor);
            
            // Send email notification
            fetch('/api/send-notification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity: newActivity })
            }).catch(console.error);
            
            // Send WhatsApp notification
            fetch('/api/send-whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activity: newActivity })
            }).catch(console.error);
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
        
        try {
            const response = await fetch(`/api/activities?id=${id}`, { method: 'DELETE' });
            if (response.ok) {
                setActivities(activities.filter(act => act.id !== id));
            } else {
                console.error('Delete failed:', response.status);
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    return (
        <main className="min-h-screen p-6 relative z-10">
            <div className="planet-1"></div>
            <div className="planet-2"></div>
            {/* Cute notification */}
            {notification && (
                <div className={`notification ${notification.split('|')[1]}`}>
                    {notification.split('|')[0]}
                </div>
            )}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        {!isAuthenticated ? (
                            <Button 
                                className="login-btn"
                                onClick={() => window.location.href = '/login'}
                            >
                                🔐 Login
                            </Button>
                        ) : (
                            <div className="user-info">
                                <span className="welcome-text">Welcome, {currentUser}! 👋</span>
                                <Button 
                                    className="logout-btn"
                                    onClick={() => {
                                        localStorage.removeItem('authenticated');
                                        localStorage.removeItem('currentUser');
                                        setIsAuthenticated(false);
                                        setCurrentUser(null);
                                    }}
                                >
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 items-center">
                        <select 
                            className="filter-bubble"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all" className="text-black">All Activities</option>
                            {Array.from(new Set(activities.flatMap(act => act.labels))).map(label => (
                                <option key={label} value={label} className="text-black">{label}</option>
                            ))}
                        </select>
                        <div className="sort-container">
                            <select 
                                className="sort-type-selector"
                                value={sortType}
                                onChange={(e) => setSortType(e.target.value as 'date' | 'rating')}
                            >
                                <option value="date">📅 Date</option>
                                <option value="rating">⭐ Rating</option>
                            </select>
                            <Button 
                                className="sort-bubble"
                                onClick={() => {
                                    if (sortOrder === 'none') setSortOrder('desc');
                                    else if (sortOrder === 'desc') setSortOrder('asc');
                                    else setSortOrder('none');
                                }}
                            >
                                Sort {sortOrder === 'desc' ? '↓' : sortOrder === 'asc' ? '↑' : '📊'}
                            </Button>
                        </div>
                        <Button 
                            className="calendar-bubble"
                            onClick={() => setShowCalendar(true)}
                        >
                            📅 Calendar
                        </Button>
                        <Button 
                            className="map-all-bubble"
                            onClick={() => setShowAllMap(true)}
                        >
                            🗺️ View All Locations
                        </Button>
                        <Button 
                            className="rate-bubble"
                            onClick={() => window.location.href = '/rate'}
                        >
                            ⭐ Rate Activities
                        </Button>
                        <Button 
                            className="suggestions-bubble"
                            onClick={() => window.location.href = '/suggestions'}
                        >
                            💡 Suggestions
                        </Button>
                    </div>
                </div>

                {isAuthenticated && currentUser && (
                    <div className="mb-4">
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
                                <Button className="add-activity-bubble">✨ Add Activity</Button>
                            </DialogTrigger>

                            <DialogContent className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-white/20 max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle className="text-white text-lg">{editingActivity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
                                </DialogHeader>

                                <div className="grid grid-cols-2 gap-3 mt-3">
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="title">Title</label>
                                        <input
                                            id="title"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                            placeholder="Activity name..."
                                            value={title}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                            placeholder="Optional details..."
                                            rows={2}
                                            value={description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="address">Address</label>
                                        <input
                                            id="address"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                            placeholder="Location..."
                                            value={address}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="labels">Labels</label>
                                        <input
                                            id="labels"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                            placeholder="outdoors, food"
                                            value={labels.join(", ")}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setLabels(e.target.value.split(",").map((l: string) => l.trim()))
                                            }
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="date">Date</label>
                                        <input
                                            id="date"
                                            type="date"
                                            required
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white focus:bg-white/20"
                                            value={date}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="ayoubRating">⭐ Ayoub's Rating</label>
                                        <input
                                            id="ayoubRating"
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white focus:bg-white/20"
                                            value={ayoubRating}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAyoubRating(Number(e.target.value))}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="medinaRating">⭐ Medina's Rating</label>
                                        <input
                                            id="medinaRating"
                                            type="number"
                                            min="1"
                                            max="10"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white focus:bg-white/20"
                                            value={medinaRating}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMedinaRating(Number(e.target.value))}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-white" htmlFor="moment">Moment Story</label>
                                        <textarea
                                            id="moment"
                                            className="w-full p-2 text-sm border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                            placeholder="Write your moment story..."
                                            rows={2}
                                            value={moment}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMoment(e.target.value)}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Button 
                                            onClick={handleAdd}
                                            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
                                        >
                                            {editingActivity ? 'Update' : 'Submit'}
                                        </Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {isAuthenticated && currentUser && (
                    <>
                        {/* Future Activities */}
                        <div className="mt-6">
                            <h3 className="galaxy-title">🚀 Future Activities</h3>
                            <div className="bubble-container">
                                {activities
                                    .filter(act => {
                                        if (!act.date) return false;
                                        const actDate = new Date(act.date);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return actDate >= today && (selectedFilter === 'all' || act.labels.includes(selectedFilter));
                                    })
                                    .sort((a, b) => {
                                        if (sortOrder === 'none') return 0;
                                        if (sortType === 'date') {
                                            const dateA = new Date(a.date).getTime();
                                            const dateB = new Date(b.date).getTime();
                                            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                                        } else {
                                            return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
                                        }
                                    })
                                    .map((act: Activity, idx: number) => {
                                        const bubbleColors = [
                                            'bubble-pink',
                                            'bubble-blue', 
                                            'bubble-green',
                                            'bubble-purple',
                                            'bubble-orange',
                                            'bubble-cyan'
                                        ];
                                        const bubbleClass = bubbleColors[idx % bubbleColors.length];
                                        
                                        return (
                                            <div key={idx} className={`activity-bubble ${bubbleClass}`}>
                                                <div className="bubble-content">
                                                    <div className="bubble-title">{act.title}</div>
                                                    <div className="bubble-date">📅 {act.date}</div>
                                                    {act.description && <div className="bubble-desc">{act.description}</div>}
                                                    {act.address && <div className="bubble-location">📍 {act.address}</div>}
                                                    {act.labels.length > 0 && <div className="bubble-labels">🏷️ {act.labels.join(", ")}</div>}
                                                    <div className="bubble-rating">
                                                        Ayoub's: {getStarRating(act.ayoubRating)}<br/>
                                                        Medina's: {getStarRating(act.medinaRating)}
                                                    </div>
                                                </div>
                                                <div className="bubble-actions">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="bubble-btn view"
                                                        onClick={() => setViewingActivity(act)}
                                                    >
                                                        👁️
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="bubble-btn edit"
                                                        onClick={() => handleEdit(act)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        className="bubble-btn delete"
                                                        onClick={() => handleDelete(act.id!)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>

                        {/* Past Activities */}
                        <div className="mt-6">
                            <h3 className="galaxy-title">📋 Past Activities</h3>
                            <div className="bubble-container">
                                {activities
                                    .filter(act => {
                                        if (!act.date) return true;
                                        const actDate = new Date(act.date);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return actDate < today && (selectedFilter === 'all' || act.labels.includes(selectedFilter));
                                    })
                                    .sort((a, b) => {
                                        if (sortOrder === 'none') return 0;
                                        if (sortType === 'date') {
                                            const dateA = new Date(a.date).getTime();
                                            const dateB = new Date(b.date).getTime();
                                            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
                                        } else {
                                            return sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
                                        }
                                    })
                                    .map((act: Activity, idx: number) => {
                                        return (
                                            <div key={idx} className="activity-bubble bubble-gray past">
                                                <div className="bubble-content">
                                                    <div className="bubble-title">{act.title}</div>
                                                    <div className="bubble-date">📅 {act.date || 'No date'}</div>
                                                    {act.description && <div className="bubble-desc">{act.description}</div>}
                                                    {act.address && <div className="bubble-location">📍 {act.address}</div>}
                                                    {act.labels.length > 0 && <div className="bubble-labels">🏷️ {act.labels.join(", ")}</div>}
                                                    <div className="bubble-rating">
                                                        Ayoub's: {getStarRating(act.ayoubRating)}<br/>
                                                        Medina's: {getStarRating(act.medinaRating)}
                                                    </div>
                                                </div>
                                                <div className="bubble-actions">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="bubble-btn view"
                                                        onClick={() => setViewingActivity(act)}
                                                    >
                                                        👁️
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        className="bubble-btn edit"
                                                        onClick={() => handleEdit(act)}
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        className="bubble-btn delete"
                                                        onClick={() => handleDelete(act.id!)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* View Details Modal */}
            {viewingActivity && (
                <div className="moment-modal-overlay" onClick={() => {
                    setViewingActivity(null);
                    if (cameFromCalendar) {
                        setShowCalendar(true);
                        setCameFromCalendar(false);
                    }
                }}>
                    <div className="moment-modal" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="moment-close"
                            onClick={() => {
                                setViewingActivity(null);
                                if (cameFromCalendar) {
                                    setShowCalendar(true);
                                    setCameFromCalendar(false);
                                }
                            }}
                        >
                            ✕
                        </button>
                        
                        <div className="moment-content">
                            <h2 className="moment-title">{viewingActivity?.title}</h2>
                            
                            <div className="moment-details">
                                <div className="detail-item">
                                    <span className="detail-label">📅 Date</span>
                                    <span className="detail-value">{viewingActivity?.date}</span>
                                </div>
                                
                                {viewingActivity?.address && (
                                    <div className="detail-item">
                                        <span className="detail-label">📍 Location</span>
                                        <span 
                                            className="detail-value clickable-address"
                                            onClick={() => {
                                                if (viewingActivity) {
                                                    setMapAddress(viewingActivity.address);
                                                    setActivityBeforeMap(viewingActivity);
                                                    setShowMap(true);
                                                    setViewingActivity(null);
                                                }
                                            }}
                                        >
                                            {viewingActivity.address}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="detail-item">
                                    <span className="detail-label">⭐ Ratings</span>
                                    <span className="detail-value">
                                        Ayoub's: {getStarRating(viewingActivity?.ayoubRating || 0)}<br/>
                                        Medina's: {getStarRating(viewingActivity?.medinaRating || 0)}
                                    </span>
                                </div>
                                
                                {viewingActivity?.labels && viewingActivity.labels.length > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">🏷️ Labels</span>
                                        <span className="detail-value">{viewingActivity.labels.join(", ")}</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="moment-description">
                                <h3 className="story-header">Moment</h3>
                                {viewingActivity?.moment ? (
                                    <p className="story-text">{viewingActivity.moment}</p>
                                ) : (
                                    <p className="story-placeholder">No moment written yet...</p>
                                )}
                            </div>
                            
                            <div className="moment-copyright">
                                <p className="copyright-text">
                                    © Moments App<br/>
                                    📞 514 998 8996<br/>
                                    📍 581 rue des alouettes, Laval, H7G 3W9, Quebec, Canada
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Modal */}
            {showMap && (
                <MapModal 
                    address={mapAddress}
                    onClose={() => {
                        setShowMap(false);
                        setMapAddress('');
                        if (activityBeforeMap) {
                            setViewingActivity(activityBeforeMap);
                            setActivityBeforeMap(null);
                        }
                    }}
                />
            )}

            {/* All Locations Modal */}
            {showAllMap && (
                <AllLocationsModal 
                    activities={activities}
                    onClose={() => setShowAllMap(false)}
                />
            )}

            {/* Calendar Modal */}
            {showCalendar && (
                <CalendarModal 
                    activities={activities}
                    onClose={() => setShowCalendar(false)}
                    onActivitySelect={(activity) => {
                        setViewingActivity(activity);
                        setCameFromCalendar(true);
                        setShowCalendar(false);
                    }}
                />
            )}
        </main>
    );
}