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
        <main className="min-h-screen p-6 bg-white">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-black">Activities</h2>
                    <div className="flex gap-3 items-center">
                        <select 
                            className="bg-gray-100 border border-gray-300 rounded px-3 py-1 text-black text-sm"
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                        >
                            <option value="all">All Activities</option>
                            {Array.from(new Set(activities.flatMap(act => act.labels))).map(label => (
                                <option key={label} value={label}>{label}</option>
                            ))}
                        </select>
                        <Button 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => window.location.href = '/rate'}
                        >
                            Rate Activities
                        </Button>
                    </div>
                </div>

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
                        <Button className="bg-green-600 hover:bg-green-700 text-white">Add Activity</Button>
                    </DialogTrigger>

                <DialogContent className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-white/20">
                    <DialogHeader>
                        <DialogTitle className="text-white">{editingActivity ? 'Edit Activity' : 'Add a new activity'}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        {/* Title */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="title">
                                Title
                            </label>
                            <input
                                id="title"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                placeholder="Activity name..."
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                placeholder="Optional details..."
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="address">
                                Address / Place
                            </label>
                            <input
                                id="address"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                placeholder="Location or map link..."
                                value={address}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Labels */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="labels">
                                Labels
                            </label>
                            <input
                                id="labels"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                placeholder="Comma-separated, e.g., outdoors, food"
                                value={labels.join(", ")}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setLabels(e.target.value.split(",").map((l: string) => l.trim()))
                                }
                            />
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="date">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                required
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white focus:bg-white/20"
                                value={date}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                            />
                        </div>

                        <Button 
                            onClick={handleAdd}
                            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        >
                            {editingActivity ? 'Update' : 'Submit'}
                        </Button>
                    </div>
                </DialogContent>
                </Dialog>
            </div>

                {/* Future Activities */}
                <div className="mt-6">
                    <h3 className="text-lg font-bold text-black mb-3">🚀 Future Activities</h3>
                    <div className="grid gap-2">
                        {activities
                            .filter(act => {
                                if (!act.date) return false;
                                const actDate = new Date(act.date);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return actDate >= today && (selectedFilter === 'all' || act.labels.includes(selectedFilter));
                            })
                            .map((act: Activity, idx: number) => {
                                const planetColors = [
                                    'bg-gradient-to-br from-blue-400 to-blue-600',
                                    'bg-gradient-to-br from-red-400 to-red-600',
                                    'bg-gradient-to-br from-yellow-400 to-orange-500',
                                    'bg-gradient-to-br from-purple-400 to-purple-600',
                                    'bg-gradient-to-br from-green-400 to-green-600',
                                    'bg-gradient-to-br from-pink-400 to-pink-600'
                                ];
                                const planetBg = planetColors[idx % planetColors.length];
                                
                                return (
                                    <div key={idx} className={`${planetBg} text-white border-white/20 rounded p-3 flex justify-between text-xs`}>
                                        <div className="flex-1">
                                            <div className="font-bold mb-1">{act.title}</div>
                                            <div className="text-white/80 mb-1">{act.date || 'No date'}</div>
                                            {act.description && <div className="text-white/80 mb-1">{act.description}</div>}
                                            {act.address && <div className="text-white/80 mb-1">📍 {act.address}</div>}
                                            {act.labels.length > 0 && <div className="text-white/80 mb-1">🏷️ {act.labels.join(", ")}</div>}
                                            <div className="text-white/80">⭐ {(act.ayoubRating + act.medinaRating) / 2}/10</div>
                                        </div>
                                        <div className="flex flex-col gap-1 ml-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-5 px-1 text-xs"
                                                onClick={() => handleEdit(act)}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                className="bg-red-500/80 hover:bg-red-600/80 border-red-400/50 h-5 px-1 text-xs"
                                                onClick={() => handleDelete(act.id!)}
                                            >
                                                Delete
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
                    <h3 className="text-lg font-bold text-black mb-3">📋 Past Activities</h3>
                    <div className="grid gap-2">
                        {activities
                            .filter(act => {
                                if (!act.date) return true; // Show activities without date in past
                                const actDate = new Date(act.date);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return actDate < today && (selectedFilter === 'all' || act.labels.includes(selectedFilter));
                            })
                            .map((act: Activity, idx: number) => {
                                const planetColors = [
                                    'bg-gradient-to-br from-gray-400 to-gray-600',
                                    'bg-gradient-to-br from-slate-400 to-slate-600',
                                    'bg-gradient-to-br from-zinc-400 to-zinc-600'
                                ];
                                const planetBg = planetColors[idx % planetColors.length];
                                
                                return (
                                    <div key={idx} className={`${planetBg} text-white border-white/20 rounded p-3 flex justify-between text-xs opacity-75`}>
                                        <div className="flex-1">
                                            <div className="font-bold mb-1">{act.title}</div>
                                            <div className="text-white/80 mb-1">{act.date || 'No date'}</div>
                                            {act.description && <div className="text-white/80 mb-1">{act.description}</div>}
                                            {act.address && <div className="text-white/80 mb-1">📍 {act.address}</div>}
                                            {act.labels.length > 0 && <div className="text-white/80 mb-1">🏷️ {act.labels.join(", ")}</div>}
                                            <div className="text-white/80">⭐ {(act.ayoubRating + act.medinaRating) / 2}/10</div>
                                        </div>
                                        <div className="flex flex-col gap-1 ml-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-5 px-1 text-xs"
                                                onClick={() => handleEdit(act)}
                                            >
                                                Edit
                                            </Button>
                                            <Button 
                                                variant="destructive" 
                                                size="sm"
                                                className="bg-red-500/80 hover:bg-red-600/80 border-red-400/50 h-5 px-1 text-xs"
                                                onClick={() => handleDelete(act.id!)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </main>
    );
}