"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function CandidateInbox() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem('token');
            const decoded: any = jwtDecode(token!);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/candidate-inbox`, {
                params: { candidateId: decoded.sub },
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        };
        fetchMessages();
    }, []);

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8">Mailbox</h2>
            <div className="space-y-4">
                {messages.map((msg: any) => (
                    <div key={msg.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-blue-600">From: {msg.leadEmailUsed}</span>
                            <span className="text-xs text-slate-400">{new Date(msg.sentAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{msg.content}</p>
                        <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                            <button className="text-sm font-black text-blue-600 hover:underline">Reply to Recruiter</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}