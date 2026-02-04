"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSearchParams } from 'next/navigation';

interface Candidate {
    id: string;
    name: string;
    email: string;
    skills: string[];
    atsScore?: number;
}

export default function LakePage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');

    // 1. Fetch Candidates from the "Lake" on Load
    useEffect(() => {
        const fetchLakeData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // In a real multi-tenant app, orgId is extracted from JWT on backend
                // For now, we fetch candidates assigned to the logged-in user's organization
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lake/candidates`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCandidates(res.data);
            } catch (err) {
                console.error("Failed to fetch lake data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLakeData();
    }, []);

    // 2. Open Confirmation Modal
    const promptConnection = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setShowModal(true);
    };

    // 3. Handle "Yes" - Send Message to Candidate & msg-DB
    const handleConnect = async () => {
        if (!selectedCandidate) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No token found");

            const decoded: any = jwtDecode(token);
            const senderId = decoded.sub; // Extracting the specific HR's ID from JWT

            const messageContent = `Hello ${selectedCandidate.name}, we've reviewed your profile in the Lake and would like to discuss a potential fit for our team.`;

            // API Call to MessageService in Backend
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/messages/send`,
                messageContent,
                {
                    params: {
                        senderId: senderId,
                        receiverId: selectedCandidate.id,
                        jobId: jobId // Passed from the URL selection
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'text/plain'
                    }
                }
            );

            alert(`Connection request sent! The conversation is now logged in msg-DB.`);
            setShowModal(false);
        } catch (err) {
            console.error("Messaging error:", err);
            alert("Error connecting with candidate. Please check backend services.");
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Loading The Lake...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            {/* Lake UI Main Container matching Lake-arc.jpg */}
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md border border-slate-200">

                {/* Header Section */}
                <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="p-2 hover:bg-slate-100 rounded-full transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Lake UI</h1>
                    </div>

                    <div className="flex gap-3">
                        <button className="px-5 py-2 bg-white border border-slate-300 rounded-md text-sm font-semibold hover:bg-slate-50 transition">
                            Filter
                        </button>
                        <button className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 shadow-sm transition">
                            ATS for all
                        </button>
                    </div>
                </div>

                {/* Candidate List (User 1 to n) */}
                <div className="divide-y divide-slate-100">
                    {candidates.length > 0 ? (
                        candidates.map((candidate, index) => (
                            <div key={candidate.id} className="p-5 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50/80 transition-all group">
                                <div className="flex items-center gap-8 w-full sm:w-auto">
                                    <span className="text-slate-400 font-mono text-sm w-4">{index + 1}.</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">{candidate.name}</p>
                                        <p className="text-xs text-slate-500">{candidate.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                                    <div className="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        ATS Score: {candidate.atsScore || '--'}
                                    </div>
                                    <button
                                        onClick={() => promptConnection(candidate)}
                                        className="px-6 py-1.5 bg-white border-2 border-blue-600 text-blue-600 rounded text-sm font-bold hover:bg-blue-600 hover:text-white transition-all duration-200"
                                    >
                                        Connect
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center text-slate-400">The Lake is currently empty.</div>
                    )}
                </div>
            </div>

            {/* Connection Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl transform transition-all border border-slate-100">
                        <h3 className="text-2xl font-black text-slate-900 text-center mb-4">
                            Do you want to connect with this candidate?
                        </h3>
                        <p className="text-slate-500 text-center text-sm mb-10 leading-relaxed">
                            Connecting with <span className="font-bold text-slate-800">{selectedCandidate?.name}</span> will log a message in the msg-DB and notify them via your organization&#39;s Lead HR contact.
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={handleConnect}
                                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}