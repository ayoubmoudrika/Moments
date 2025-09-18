'use client';

import { useParams } from 'next/navigation';

export default function RoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Room: {roomId}
        </h1>
        <p className="text-gray-600">
          This is a test room page. The room ID is: <code className="bg-gray-100 px-2 py-1 rounded">{roomId}</code>
        </p>
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            🚧 This is a basic test page. More functionality coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}
