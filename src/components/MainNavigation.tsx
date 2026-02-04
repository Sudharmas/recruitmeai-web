"use client";
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

export default function MainNavigation() {
    const pathname = usePathname();
    const [role, setRole] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    const isAuthPage = pathname === '/' || pathname.includes('/login') || pathname.includes('/signup');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isAuthPage) {
            try {
                const decoded: any = jwtDecode(token);
                setRole(decoded.role);
                setIsVisible(true);
            } catch (e) {
                setIsVisible(false);
            }
        } else {
            setIsVisible(false);
        }
    }, [pathname, isAuthPage]);

    if (!isVisible) return null;

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
            <div className="p-8 text-2xl font-black italic text-blue-400">RecruitMe AI</div>

            <nav className="flex-1 px-4 space-y-2">
                {/* Links for EVERYONE */}
                <Link href="/candidate/dashboard" className="block p-3 hover:bg-slate-800 rounded-xl">🏠 Dashboard</Link>

                {/* Links for HR ONLY */}
                {role === 'LEAD_HR' && (
                    <Link href="/dashboard/team" className="block p-3 hover:bg-slate-800 rounded-xl">👥 Team Management</Link>
                )}

                {/* Links for CANDIDATES ONLY */}
                {role === 'CANDIDATE' && (
                    <Link href="/candidate/jobs" className="block p-3 hover:bg-slate-800 rounded-xl">💼 Browse Jobs</Link>
                )}
            </nav>
        </aside>
    );
}