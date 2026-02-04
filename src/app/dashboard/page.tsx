"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Stats {
    totalJobs: number;
    totalConnections: number;
    activeHRs: number;
}

export default function AdminOverview() {
    const [stats, setStats] = useState<Stats>({ totalJobs: 0, totalConnections: 0, activeHRs: 0 });
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchAdminData = async () => {
            const token = localStorage.getItem('token');
            const decoded: any = jwtDecode(token!);

            // Fetch Audit Logs for the msg-DB
            const logRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/activity/logs`, {
                params: { orgId: decoded.orgId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(logRes.data.slice(0, 5)); // Show only latest 5

            // Mock stats for visualization
            setStats({ totalJobs: 12, totalConnections: logRes.data.length, activeHRs: 4 });
        };
        fetchAdminData();
    }, []);

    return (
        <div className="p-10">
            <h2 className="text-3xl font-black mb-8">Organization Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-xs uppercase mb-2">Total Job Buckets</p>
                    <p className="text-4xl font-black text-blue-600">{stats.totalJobs}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-xs uppercase mb-2">Lake Connections</p>
                    <p className="text-4xl font-black text-purple-600">{stats.totalConnections}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-400 font-bold text-xs uppercase mb-2">Active Recruiters</p>
                    <p className="text-4xl font-black text-emerald-600">{stats.activeHRs}</p>
                </div>
            </div>

            {/* Recent Activity Feed (Audit Trail) */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 font-bold text-slate-800">Team Activity (msg-DB Logs)</div>
                <div className="divide-y divide-slate-100">
                    {logs.map((log: any) => (
                        <div key={log.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition">
                            <div>
                                <p className="text-sm font-bold text-slate-900">
                                    HR User contacted <span className="text-blue-600">Candidate {log.receiverId.substring(0,8)}</span>
                                </p>
                                <p className="text-xs text-slate-400 mt-1">Authorized via: {log.leadEmailUsed}</p>
                            </div>
                            <span className="text-xs text-slate-300 font-mono">{new Date(log.sentAt).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}