"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (user: 'ayoub' | 'medina') => {
        const correctPassword = user === 'ayoub' ? 'ayoub2024' : 'medina2024';
        
        if (password === correctPassword) {
            localStorage.setItem("authenticated", "true");
            localStorage.setItem("currentUser", user);
            router.push("/");
        } else {
            setError(`Incorrect password for ${user === 'ayoub' ? 'Ayoub' : 'Medina'}`);
        }
    };

    return (
        <main className="min-h-screen p-6 relative z-10 flex items-center justify-center">
            <div className="planet-1"></div>
            <div className="planet-2"></div>
            
            <div className="login-container">
                <h1 className="login-title">🌟 Moments App</h1>
                <p className="login-subtitle">Select user and enter password</p>
                
                <div className="login-form">
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && <p className="login-error">{error}</p>}
                    
                    <div className="user-buttons">
                        <Button 
                            className="login-submit ayoub-btn"
                            onClick={() => handleLogin('ayoub')}
                            disabled={!password}
                        >
                            👨💻 Login as Ayoub
                        </Button>
                        <Button 
                            className="login-submit medina-btn"
                            onClick={() => handleLogin('medina')}
                            disabled={!password}
                        >
                            👩💼 Login as Medina
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}