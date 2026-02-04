"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', href: '/candidate/dashboard', icon: '🏠' },
        { name: 'Job Posts', href: '/candidate/jobs', icon: '🔍' },
        { name: 'Mailbox', href: '/candidate/messages', icon: '📩' },
        { name: 'My Profile', href: '/candidate/profile', icon: '👤' },
    ];

    return (
        <div className="flex min-h-screen bg-[#F8FAFC]">
            {/* Sleek Left Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
                <div className="p-8">
                    <div className="text-2xl font-black text-blue-600 tracking-tighter">RECRUITME.AI</div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Candidate Hub</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                                pathname === item.href
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}