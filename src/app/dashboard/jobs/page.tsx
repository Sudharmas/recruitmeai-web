"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface Job {
    id: string;
    title: string;
    role: string;
}

export default function JobGateway() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        role: '',
        experienceRequired: 0,
        requiredSkills: '',
        description: ''
    });
    const router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            const decoded: any = jwtDecode(token);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/jobs/all`, {
                params: { orgId: decoded.orgId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(res.data);
        };
        fetchJobs();
    }, []);

    const handleCreateAndGo = async () => {
        const token = localStorage.getItem('token');
        const decoded: any = jwtDecode(token!);

        // Transform comma-separated skills into an array
        const jobPayload = {
            ...formData,
            requiredSkills: formData.requiredSkills.split(',').map(s => s.trim())
        };

        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`,
            jobPayload,
            { params: { orgId: decoded.orgId }, headers: { Authorization: `Bearer ${token}` } }
        );
        router.push(`/dashboard/lake?jobId=${res.data.id}`);
    };

    return (
        <div className="p-12 max-w-6xl mx-auto">
            <h2 className="text-4xl font-black mb-10 text-slate-900">Enterprise Job Buckets</h2>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* New Job Form with Document Parameters */}
                <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-blue-600">Create New Job</h3>
                    <div className="space-y-4">
                        <input
                            className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:border-blue-500"
                            placeholder="Job Title (e.g. Senior Backend Dev)"
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                        <input
                            className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:border-blue-500"
                            placeholder="Role Type (e.g. Java Engineer)"
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        />
                        <div className="flex gap-4">
                            <input
                                type="number"
                                className="flex-1 p-4 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:border-blue-500"
                                placeholder="Years Experience"
                                onChange={(e) => setFormData({...formData, experienceRequired: parseInt(e.target.value)})}
                            />
                            <input
                                className="flex-[2] p-4 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:border-blue-500"
                                placeholder="Skills (Java, Spring, SQL)"
                                onChange={(e) => setFormData({...formData, requiredSkills: e.target.value})}
                            />
                        </div>
                        <textarea
                            className="w-full p-4 bg-slate-50 rounded-xl outline-none border border-slate-100 focus:border-blue-500 h-32"
                            placeholder="Full Job Description"
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                        <button onClick={handleCreateAndGo} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                            Launch Bucket & Enter Lake →
                        </button>
                    </div>
                </div>

                {/* List of Existing Buckets */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-800">Select Existing Job</h3>
                    <div className="grid gap-4 overflow-y-auto max-h-[600px] pr-2">
                        {jobs.map(job => (
                            <button
                                key={job.id}
                                onClick={() => router.push(`/dashboard/lake?jobId=${job.id}`)}
                                className="group w-full p-6 text-left bg-white border border-slate-200 rounded-3xl hover:border-blue-500 hover:ring-4 hover:ring-blue-50 transition-all flex justify-between items-center"
                            >
                                <div>
                                    <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition">{job.title}</h4>
                                    <p className="text-sm text-slate-500 italic">{job.role}</p>
                                </div>
                                <span className="text-slate-300 group-hover:text-blue-500">→</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}