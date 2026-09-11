"use client";

import { Trash2, Edit2, Mail, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { useCopilotStore } from "@/store/copilotStore";
import { useEmailAccountStore } from "@/store/emailAccountStore";

export default function EmailAccountList({
    setSelectedProfileName,
}: {
    setSelectedProfileName: (name: string) => void;
}) {
    const { copilotData, updateCopilotData } = useCopilotStore();
    const { accounts, isLoading, deleteAccount, setEditingAccount, setShowModal } = useEmailAccountStore();
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    useEffect(() => {
        const handleWindowClick = () => setOpenMenuId(null);
        if (openMenuId !== null) {
            window.addEventListener("click", handleWindowClick);
        }
        return () => window.removeEventListener("click", handleWindowClick);
    }, [openMenuId]);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this account?")) return;
        await deleteAccount(id);
        if (copilotData.emailAccountId === id) {
            updateCopilotData({ emailAccountId: null });
        }
    };

    if (isLoading) return null;
    if (accounts.length === 0) return null;

    return (
        <div className="mt-6">
            <div className="space-y-3">
                {accounts.map((profile) => (
                    <div key={profile.id} className="flex gap-2 items-center">
                        <button
                            type="button"
                            className={`flex-1 flex items-center justify-between gap-4 p-4 rounded-xl border ${copilotData.emailAccountId === profile.id
                                    ? "border-primary/20 bg-primary-light"
                                    : "border-gray-200 hover:border-primary/20 hover:bg-primary/5"
                                } transition-colors text-left`}
                            onClick={() => {
                                updateCopilotData({ emailAccountId: profile.id });
                                setSelectedProfileName(profile.id.toString());
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
                                    <Mail size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="font-semibold text-sm text-gray-900">
                                            {profile.profileName || profile.email}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {profile.email} - {profile.provider}
                                    </p>
                                </div>
                            </div>

                            <div className="relative isolate shrink-0 flex items-center">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(openMenuId === profile.id ? null : profile.id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <MoreVertical size={18} />
                                </button>
                                {openMenuId === profile.id && (
                                    <div
                                        className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(null);
                                                setEditingAccount(profile);
                                                setShowModal(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                        >
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenMenuId(null);
                                                handleDelete(profile.id);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
