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
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);

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
    const [rating, setRating] = useState<number>(1);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    // Reset all form fields
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setAddress("");
        setLabels([]);
        setPicture("");
        setRating(1);
    };

    const handleAdd = async () => {
        if (!title.trim()) return;
        
        if (editingActivity) {
            // Update existing activity
            const response = await fetch('/api/activities', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingActivity.id, title, description, address, labels, picture, rating })
            });
            
            const updatedActivity = await response.json();
            setActivities(activities.map(act => act.id === editingActivity.id ? updatedActivity : act));
        } else {
            // Create new activity
            const response = await fetch('/api/activities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, address, labels, picture, rating })
            });
            
            const newActivity = await response.json();
            setActivities([newActivity, ...activities]);
            
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
        setRating(activity.rating);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;
        
        await fetch(`/api/activities?id=${id}`, { method: 'DELETE' });
        setActivities(activities.filter(act => act.id !== id));
    };

    return (
        <main className="min-h-screen p-6 relative" style={{
            background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
            backgroundAttachment: 'fixed'
        }}>
            {/* Stars */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`
                        }}
                    />
                ))}
            </div>
            
            <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-4 text-white">Activities</h2>

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
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Add Activity</Button>
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

                        {/* Picture */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="picture">
                                Picture URL
                            </label>
                            <input
                                id="picture"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white placeholder-white/70 focus:bg-white/20"
                                placeholder="Optional image URL..."
                                value={picture}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPicture(e.target.value)}
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block mb-1 font-medium text-white" htmlFor="rating">
                                Rating (1–10)
                            </label>
                            <select
                                id="rating"
                                className="w-full p-2 border border-white/30 rounded bg-white/10 text-white focus:bg-white/20"
                                value={rating}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRating(Number(e.target.value))}
                            >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
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

                {/* Activities List */}
                <div className="grid gap-4 mt-6">
                {activities.map((act: Activity, idx: number) => {
                    const planetColors = [
                        'bg-gradient-to-br from-blue-400 to-blue-600', // Earth-like
                        'bg-gradient-to-br from-red-400 to-red-600',   // Mars-like
                        'bg-gradient-to-br from-yellow-400 to-orange-500', // Jupiter-like
                        'bg-gradient-to-br from-purple-400 to-purple-600', // Neptune-like
                        'bg-gradient-to-br from-green-400 to-green-600',   // Alien planet
                        'bg-gradient-to-br from-pink-400 to-pink-600'     // Fantasy planet
                    ];
                    const planetBg = planetColors[idx % planetColors.length];
                    
                    return (
                        <Card key={idx} className={`${planetBg} text-white border-white/20 shadow-lg backdrop-blur-sm`}>
                            <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold">{act.title}</h3>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                                        onClick={() => handleEdit(act)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        className="bg-red-500/80 hover:bg-red-600/80 border-red-400/50"
                                        onClick={() => handleDelete(act.id!)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            {act.description && <p>{act.description}</p>}
                            {act.address && <p>📍 {act.address}</p>}
                            {act.labels.length > 0 && <p>🏷️ {act.labels.join(", ")}</p>}
                            {act.picture && (
                                <img
                                    src={act.picture}
                                    alt={act.title}
                                    className="mt-2 w-full max-w-xs rounded"
                                />
                            )}
                            <p>Rating: ⭐ {act.rating} (hidden from friend until both rate)</p>
                            </CardContent>
                        </Card>
                    );
                })}
                </div>
            </div>
        </main>
    );
}
