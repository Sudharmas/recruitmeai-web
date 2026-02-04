"use client";
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8">

                {/* HR Side: Enterprise Gateway */}
                <div className="bg-white p-12 rounded-[3rem] border-4 border-white shadow-2xl shadow-blue-100 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-blue-200">💼</div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Enterprise HR</h2>
                    <p className="text-slate-500 mb-10 font-medium">Manage your organization, team, and the talent lake.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition"
                    >
                        Enter HR Suite →
                    </button>
                </div>

                {/* Candidate Side: Talent Gateway */}
                <div className="bg-[#FCEDDA] p-12 rounded-[3rem] border-4 border-white shadow-2xl shadow-orange-100 flex flex-col items-center text-center transition-transform hover:scale-[1.02]">
                    <div className="w-20 h-20 bg-[#EE4E34] rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-lg shadow-orange-200">🚀</div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Talent Portal</h2>
                    <p className="text-slate-500 mb-10 font-medium">Discover opportunities and message recruiters directly.</p>
                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={() => router.push('/candidate/login')}
                            className="w-full py-4 bg-[#EE4E34] text-white rounded-2xl font-black hover:bg-[#d6452e] transition"
                        >
                            Sign In to Profile
                        </button>
                        <button
                            onClick={() => router.push('/candidate/signup')}
                            className="text-sm font-bold text-[#EE4E34] hover:underline"
                        >
                            New here? Create Candidate Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}