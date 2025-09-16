"use client";

import { useState } from "react";
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
    title: string;
    description?: string;
    address?: string;
    labels: string[];
    picture?: string;
    rating: number;
}

export default function ActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [labels, setLabels] = useState<string[]>([]);
    const [picture, setPicture] = useState("");
    const [rating, setRating] = useState<number>(1);

    const [dialogOpen, setDialogOpen] = useState(false);

    // Reset all form fields
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setAddress("");
        setLabels([]);
        setPicture("");
        setRating(1);
    };

    const handleAdd = () => {
        if (!title.trim()) return;
        setActivities([
            ...activities,
            { title, description, address, labels, picture, rating },
        ]);
        resetForm();
        setDialogOpen(false); // Close the dialog
    };

    return (
        <main className="p-6">
            <h2 className="text-2xl font-bold mb-4">Activities</h2>

            <Dialog
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (!open) resetForm(); // Reset fields if user closes with X
                }}
            >
                <DialogTrigger asChild>
                    <Button>Add Activity</Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a new activity</DialogTitle>
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
                                onChange={(e) => setTitle(e.target.value)}
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
                                onChange={(e) => setDescription(e.target.value)}
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
                                onChange={(e) => setAddress(e.target.value)}
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
                                onChange={(e) =>
                                    setLabels(e.target.value.split(",").map((l) => l.trim()))
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
                                onChange={(e) => setPicture(e.target.value)}
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
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button onClick={handleAdd}>Submit</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Activities List */}
            <div className="grid gap-4 mt-6">
                {activities.map((act, idx) => (
                    <Card key={idx}>
                        <CardContent>
                            <h3 className="font-bold">{act.title}</h3>
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
