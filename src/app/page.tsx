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
        <main className="p-6">
            <h2 className="text-2xl font-bold mb-4">Activities</h2>

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
                    <Button>Add Activity</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add a new activity'}</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 mt-4">
                        {/* Title */}
                        <div>
                            <label className="block mb-1 font-medium" htmlFor="title">
                                Title
                            </label>
                            <input
                                id="title"
                                className="w-full p-2 border rounded"
                                placeholder="Activity name..."
                                value={title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1 font-medium" htmlFor="description">
                                Description
                            </label>
                            <textarea
                                id="description"
                                className="w-full p-2 border rounded"
                                placeholder="Optional details..."
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block mb-1 font-medium" htmlFor="address">
                                Address / Place
                            </label>
                            <input
                                id="address"
                                className="w-full p-2 border rounded"
                                placeholder="Location or map link..."
                                value={address}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                            />
                        </div>

                        {/* Labels */}
                        <div>
                            <label className="block mb-1 font-medium" htmlFor="labels">
                                Labels
                            </label>
                            <input
                                id="labels"
                                className="w-full p-2 border rounded"
                                placeholder="Comma-separated, e.g., outdoors, food"
                                value={labels.join(", ")}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setLabels(e.target.value.split(",").map((l: string) => l.trim()))
                                }
                            />
                        </div>

                        {/* Picture */}
                        <div>
                            <label className="block mb-1 font-medium" htmlFor="picture">
                                Picture URL
                            </label>
                            <input
                                id="picture"
                                className="w-full p-2 border rounded"
                                placeholder="Optional image URL..."
                                value={picture}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPicture(e.target.value)}
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block mb-1 font-medium" htmlFor="rating">
                                Rating (1–10)
                            </label>
                            <select
                                id="rating"
                                className="w-full p-2 border rounded"
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

                        <Button onClick={handleAdd}>{editingActivity ? 'Update' : 'Submit'}</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Activities List */}
            <div className="grid gap-4 mt-6">
                {activities.map((act: Activity, idx: number) => (
                    <Card key={idx}>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold">{act.title}</h3>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleEdit(act)}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
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
                ))}
            </div>
        </main>
    );
}
