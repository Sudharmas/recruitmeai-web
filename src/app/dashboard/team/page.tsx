"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function TeamManagement() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHR, setNewHR] = useState({ name: '', email: '', password: '' });

    const fetchTeam = async () => {
        const token = localStorage.getItem('token');
        const decoded: any = jwtDecode(token!);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/hr/team`, {
            params: { orgId: decoded.orgId },
            headers: { Authorization: `Bearer ${token}` }
        });
        setTeam(res.data);
    };
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this HR member?")) return;

        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/hr/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchTeam(); // Refresh the list
    };

    const handleEdit = (member: TeamMember) => {
        // You would typically open a modal here populated with 'member' details
        // and then call the PUT endpoint we created in Step 1.
        console.log("Editing member:", member);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchTeam(); }, []);

    // Inside the handleAddMember function
    const handleAddMember = async () => {
        try {
            const token = localStorage.getItem('token');
            const decoded: any = jwtDecode(token!);

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/hr/add`,
                newHR, // Contains { name, email, password }
                {
                    params: { orgId: decoded.orgId },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(`Sub-HR ${newHR.name} created successfully! You can now give them their credentials.`);
            setShowAddModal(false);
            setNewHR({ name: '', email: '', password: '' }); // Reset form
            fetchTeam(); // Refresh the list
        } catch (err) {
            console.error("Creation failed", err);
            alert("Error creating Sub-HR. Check if email already exists.");
        }
    };

    return (
        <div className="p-10">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-slate-900">HR Team Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                    + Invite Sub-HR
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-5 text-sm font-bold text-slate-500 uppercase">Name</th>
                        <th className="p-5 text-sm font-bold text-slate-500 uppercase">Email</th>
                        <th className="p-5 text-sm font-bold text-slate-500 uppercase">Role</th>
                        <th className="p-5 text-sm font-bold text-slate-500 uppercase">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {team.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition">
                            <td className="p-5 font-bold text-slate-900">{member.name}</td>
                            <td className="p-5 text-slate-600">{member.email}</td>
                            <td className="p-5">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
          member.role === 'LEAD_HR' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {member.role.replace('_', ' ')}
      </span>
                            </td>
                            <td className="p-5">
                                {/* Lead HR cannot delete themselves */}
                                {member.role !== 'LEAD_HR' && (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleEdit(member)}
                                            className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Add HR Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-black mb-6">Invite Sub-HR</h3>
                        <div className="space-y-4">
                            <input className="w-full p-4 border rounded-xl" placeholder="Full Name" onChange={e => setNewHR({...newHR, name: e.target.value})} />
                            <input className="w-full p-4 border rounded-xl" placeholder="Email Address" onChange={e => setNewHR({...newHR, email: e.target.value})} />
                            <input className="w-full p-4 border rounded-xl" type="password" placeholder="Temporary Password" onChange={e => setNewHR({...newHR, password: e.target.value})} />
                            <button onClick={handleAddMember} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">Send Invite</button>
                            <button onClick={() => setShowAddModal(false)} className="w-full py-2 text-slate-400 font-bold">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}