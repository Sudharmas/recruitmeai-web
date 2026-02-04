"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function OrgSettings() {
    const [org, setOrg] = useState({ name: '', leadEmail: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrg = async () => {
            const token = localStorage.getItem('token');
            const decoded: any = jwtDecode(token!);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/org/details`, {
                params: { orgId: decoded.orgId },
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrg(res.data);
            setLoading(false);
        };
        fetchOrg();
    }, []);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const decoded: any = jwtDecode(token!);
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/org/update`, org, {
            params: { orgId: decoded.orgId },
            headers: { Authorization: `Bearer ${token}` }
        });
        alert("Identity updated. All future messages will use this branding.");
    };

    return (
        <div className="p-12 max-w-2xl">
            <h2 className="text-3xl font-black mb-2 text-slate-900">Organization Settings</h2>
            <p className="text-slate-500 mb-8 font-medium">Manage the central identity used for all candidate outreach.</p>

            <div className="space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Company Name</label>
                    <input
                        value={org.name}
                        onChange={(e) => setOrg({...org, name: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Lead HR Email (The &#34;Sender&#34; ID)</label>
                    <input
                        value={org.leadEmail}
                        onChange={(e) => setOrg({...org, leadEmail: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-blue-500 font-bold"
                    />
                    <p className="mt-2 text-[10px] text-slate-400 italic italic">
                        * This email is used as the global identity in the msg-DB for all team members.
                    </p>
                </div>
                <button
                    onClick={handleUpdate}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-black hover:bg-black transition shadow-xl"
                >
                    Save Identity
                </button>
            </div>
        </div>
    );
}