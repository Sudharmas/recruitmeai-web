"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    role: string;
    orgName?: string;
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [role, setRole] = useState<string>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRole(decoded.role);
                const isAuthPage = pathname.includes('/login') || pathname.includes('/signup') || pathname === '/';
            } catch (e) {
                router.push('/login');
            }
        }
    }, [router]);

    const navItems = [
        { name: 'Job Buckets', href: '/dashboard/jobs', icon: '💼' },
        { name: 'The Lake', href: '/dashboard/lake', icon: '🌊' },
        { name: 'Messages', href: '/dashboard/messages', icon: '📩' },
    ];

    const handleLogout = () => {
        localStorage.clear();
        router.push('/login');
    };

    return (
        <aside className="w-72 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
            <div className="p-8">
                <div className="text-2xl font-black tracking-tighter text-blue-500 mb-1">RECRUITME.AI</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise PaaS</div>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                            pathname.startsWith(item.href)
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}

                {/* Lead HR Exclusive: Team Management */}
                {role === 'LEAD_HR' && (
                    <Link
                        href="/dashboard/team"
                        className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-bold transition-all ${
                            pathname === '/dashboard/team'
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <span className="text-xl">👥</span>
                        Team Management
                    </Link>
                )}
            </nav>

            <div className="p-6 border-t border-slate-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 font-bold transition-colors"
                >
                    <span>🚪</span> Logout
                </button>
            </div>
        </aside>
    );
}