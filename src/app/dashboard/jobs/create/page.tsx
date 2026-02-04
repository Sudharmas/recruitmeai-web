"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateJob() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/jobs/create`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            router.push('/dashboard/lake'); // Go back to selection
        } catch (err) {
            alert("Failed to create job.");
        }
    };

    return (
        <div className="p-10 max-w-2xl">
            <h2 className="text-3xl font-black mb-6">Create New Job Bucket</h2>
            <form onSubmit={handleCreate} className="space-y-4">
                <input
                    className="w-full p-4 border rounded-xl"
                    placeholder="Job Title (e.g. Frontend Engineer)"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    className="w-full p-4 border rounded-xl h-40"
                    placeholder="Job Description..."
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
                    Create & Open Lake
                </button>
            </form>
        </div>
    );
}