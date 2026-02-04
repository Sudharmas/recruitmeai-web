"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface Job {
    id: string;
    title: string;
    role: string;
    experienceRequired: number;
    requiredSkills: string[];
    description: string;
}

export default function CandidateSearch() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [query, setQuery] = useState('');
    const [applyingId, setApplyingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchJobs = async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/applications/public/all`);
            setJobs(res.data);
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId: string) => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Please login first");

        const decoded: any = jwtDecode(token);
        setApplyingId(jobId);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/applications/apply`, null, {
                params: { jobId, candidateId: decoded.sub }
            });
            alert("Application sent! HR will be notified.");
        } catch (err) {
            alert("Failed to apply.");
        } finally {
            setApplyingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            {/* Search Header */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 mb-12">
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Discover Opportunities</h2>
                <p className="text-slate-500 mb-8 font-medium italic">Showing all active Job Buckets across the platform</p>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by tech stack (e.g. Spring Boot, Python)..."
                        className="w-full p-6 pl-16 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none transition-all font-bold text-lg"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase())).map(job => (
                    <div key={job.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">🏢</div>
                            <span className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {job.experienceRequired}+ YRS EXP
              </span>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 mb-2">{job.title}</h3>
                        <p className="text-blue-600 font-bold text-sm mb-4 uppercase tracking-tighter">{job.role}</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {job.requiredSkills.map(skill => (
                                <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-100">
                  #{skill}
                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => handleApply(job.id)}
                            disabled={applyingId === job.id}
                            className={`w-full py-5 rounded-2xl font-black transition-all shadow-lg ${
                                applyingId === job.id
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-slate-900 text-white hover:bg-blue-600 shadow-slate-200'
                            }`}
                        >
                            {applyingId === job.id ? 'Processing...' : 'Quick Apply →'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}