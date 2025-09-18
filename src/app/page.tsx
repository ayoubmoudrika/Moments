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

interface Activity {
    id?: number;
    title: string;
    description: string;
    address: string;
    labels: string[];
    picture?: string;
    rating: number;
    date: string;
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
    const [rating, setRating] = useState(5);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

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
        setRating(5);
    };

    const handleAdd = async () => {
        if (!title.trim() || !date) return;
        
        if (editingActivity) {
            // Update existing activity
            const response = await fetch('/api/activities', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingActivity.id, title, description, address, labels, picture, rating, date })
            });
            
            const updatedActivity = await response.json();
            setActivities(activities.map(act => act.id === editingActivity.id ? updatedActivity : act));
        } else {
            // Create new activity
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, address, labels, picture, rating, date })
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
        }
        
        resetForm();
        setDialogOpen(false);
        setEditingActivity(null);
    };

    const handleEdit = (activity: Activity) => {
        setEditingActivity(activity);
        setTitle(activity.title);
        setDescription(activity.description);
        setAddress(activity.address);
        setLabels(activity.labels);
        setPicture(activity.picture || '');
        setDate(activity.date || '2024-09-17');
        setRating(activity.rating || 5);
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
                <div className="flex justify-end items-center mb-4">
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
                        <Button 
                            className="rate-bubble"
                            onClick={() => window.location.href = '/rate'}
                        >
                            ⭐ Rate Activities
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
                        <Button className="add-activity-bubble">✨ Add Activity</Button>
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

                        {/* Rating */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="rating">
                                Rating (1-10)
                            </label>
                            <input
                                id="rating"
                                type="number"
                                min="1"
                                max="10"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white focus:bg-white/20"
                                value={rating}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRating(Number(e.target.value))}
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
                                            <div className="bubble-rating">⭐ {act.rating}/10</div>
                                        </div>
                                        <div className="bubble-actions">
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
                            .map((act: Activity, idx: number) => {
                                return (
                                    <div key={idx} className="activity-bubble bubble-gray past">
                                        <div className="bubble-content">
                                            <div className="bubble-title">{act.title}</div>
                                            <div className="bubble-date">📅 {act.date || 'Pas de date'}</div>
                                            {act.description && <div className="bubble-desc">{act.description}</div>}
                                            {act.address && <div className="bubble-location">📍 {act.address}</div>}
                                            {act.labels.length > 0 && <div className="bubble-labels">🏷️ {act.labels.join(", ")}</div>}
                                            <div className="bubble-rating">⭐ {act.rating}/10</div>
                                        </div>
                                        <div className="bubble-actions">
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
            </div>
        </main>
    );
}
