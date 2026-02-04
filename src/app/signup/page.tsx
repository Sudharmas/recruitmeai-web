"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        orgName: '',
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup/lead`, formData);
            alert("Account created successfully! Redirecting to login...");
            router.push('/login');
        } catch (err) {
            alert("Registration failed. Email might already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900">Create your Workspace</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Set up your organization and start hiring with AI.
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Acme Corp"
                            onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                        />
                    </div>

                    <hr className="my-4 border-slate-200" />

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Lead HR Full Name</label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="John Doe"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Work Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="john@company.com"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        {loading ? "Creating Workspace..." : "Get Started Free"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-slate-600">
                        Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}