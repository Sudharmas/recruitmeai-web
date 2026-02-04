"use client";
import { useState, useEffect } from 'react';

export default function UserNotifications() {
    const [unreadCount, setUnreadCount] = useState(0);

    // Logic: In a real app, this would use WebSockets or Polling
    // to check the msg-DB for new replies
    useEffect(() => {
        // Mocking an incoming notification from a candidate
        const interval = setInterval(() => {
            // Logic would go here to fetch count from API
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition">
            <span className="text-xl">🔔</span>
            {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          {unreadCount}
        </span>
            )}
        </div>
    );
}