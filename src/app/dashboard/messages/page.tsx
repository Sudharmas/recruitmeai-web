"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export default function MessageCenter() {
    const [conversations, setConversations] = useState([]);
    const [selectedThread, setSelectedThread] = useState<any>(null);

    // 1. Logic: Fetch all conversations for this Org from msg-DB
    useEffect(() => {
        const fetchThreads = async () => {
            const token = localStorage.getItem('token');
            const decoded: any = jwtDecode(token!);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/inbox`, {
                params: { orgId: decoded.orgId }
            });
            setConversations(res.data);
        };
        fetchThreads();
    }, []);

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* LEFT: Thread List */}
            <div className="w-1/3 border-r border-slate-200 bg-white overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-black">Mailbox</h2>
                    <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-[10px] font-bold">LIVE</span>
                </div>
                {conversations.map((chat: any) => (
                    <div
                        key={chat.id}
                        onClick={() => setSelectedThread(chat)}
                        className={`p-6 cursor-pointer border-b border-slate-50 transition ${selectedThread?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-50'}`}
                    >
                        <p className="font-bold text-slate-900">Candidate ID: {chat.receiverId.substring(0,8)}</p>
                        <p className="text-xs text-slate-500 truncate">{chat.content}</p>
                    </div>
                ))}
            </div>

            {/* RIGHT: Chat Window */}
            <div className="flex-1 bg-slate-50 flex flex-col">
                {selectedThread ? (
                    <>
                        <div className="p-6 bg-white border-b border-slate-200">
                            <h3 className="font-black">Conversation Log</h3>
                            <p className="text-[10px] text-slate-400 font-mono italic">Ref ID: {selectedThread.id}</p>
                        </div>
                        <div className="flex-1 p-8 overflow-y-auto space-y-4">
                            <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-md ml-auto shadow-md">
                                <p className="text-sm font-bold opacity-80 mb-1">Sent via Lead HR Email</p>
                                {selectedThread.content}
                            </div>
                            {/* This is where candidate replies will appear later */}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 italic">
                        Select a candidate thread to view the history.
                    </div>
                )}
            </div>
        </div>
    );
}