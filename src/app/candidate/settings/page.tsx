"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CandidateSettings() {
    const [profile, setProfile] = useState<any>({});
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // 1. Upload Resume Logic
    const handleResumeUpload = async () => {
        if (!file) return;
        setUploading(true);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        // Upload to Supabase Bucket
        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file);

        if (uploadError) {
            alert("Upload failed");
        } else {
            const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
            // Save this URL to the user's profile in our DB
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/candidate/update-resume`, {
                resumeUrl: data.publicUrl
            });
            alert("Resume uploaded and linked to profile!");
        }
        setUploading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-10">
            <h2 className="text-3xl font-black mb-8 text-slate-900">Profile Settings</h2>

            <div className="grid gap-8">
                {/* Resume Section */}
                <div className="bg-white p-8 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <h3 className="font-bold text-lg mb-4">Resume / CV</h3>
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        onClick={handleResumeUpload}
                        disabled={uploading}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-slate-300"
                    >
                        {uploading ? 'Uploading...' : 'Sync Resume to Cloud'}
                    </button>
                </div>

                {/* Profile Edit Form */}
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg mb-6">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="p-4 bg-slate-50 rounded-xl outline-none" placeholder="Full Name" />
                        <input className="p-4 bg-slate-50 rounded-xl outline-none" placeholder="Phone Number" />
                        <textarea className="p-4 bg-slate-50 rounded-xl outline-none col-span-2" placeholder="Professional Bio" />
                    </div>
                    <button className="mt-6 w-full py-4 bg-slate-900 text-white rounded-xl font-black">Save Profile Changes</button>
                </div>
            </div>
        </div>
    );
}