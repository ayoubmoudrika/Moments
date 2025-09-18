'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RatingRoom() {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setError('');
    try {
      // For now, just create a simple room ID
      const roomId = Math.random().toString(36).substring(2, 10);
      router.push(`/r/${roomId}`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
      console.error('Error creating room:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !displayName.trim()) {
      setError('Please enter both room code and your name');
      return;
    }

    setIsJoining(true);
    setError('');
    try {
      router.push(`/r/${roomCode.trim()}`);
    } catch (err) {
      setError('Failed to join room. Please check the room code and try again.');
      console.error('Error joining room:', err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Activity Picker
        </h1>
        <p className="text-xl text-gray-600">
          Find the perfect activity for you and your partner
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="space-y-6">
          {/* Create Room */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Create a Room
            </h2>
            <p className="text-gray-600 mb-4">
              Start a new activity selection session
            </p>
            <button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Join a Room
            </h2>
            <p className="text-gray-600 mb-4">
              Enter a room code to join an existing session
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Room Code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={8}
              />
              <input
                type="text"
                placeholder="Your Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={50}
              />
              <button
                onClick={handleJoinRoom}
                disabled={isJoining || !roomCode.trim() || !displayName.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isJoining ? 'Joining...' : 'Join Room'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}