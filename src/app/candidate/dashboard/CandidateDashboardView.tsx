"use client";
import React from 'react';
import UserNotifications from '@/components/UserNotifications';

export default function CandidateDashboardView() {
    return (
        <div className="p-8">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Applications</h1>
                <UserNotifications />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-blue-600 font-bold">Active Jobs</h3>
                    <p className="text-4xl font-black text-slate-900">04</p>
                </div>
            </div>
        </div>
    );
}