"use client";

import {
  CheckCircle,
  ChevronRight,
  Zap,
  Inbox,
  Trash2,
  Edit2,
  Mail,
  MoreVertical,
} from "lucide-react";

import Image from "next/image";
import { useCopilotStore } from "../../../../../store/copilotStore";
import type { NewCopilotContext } from "@/app/dashboard/copilots/new/page";
import OtherProviderPopUp from "@/components/ui/NewCopilot/StepTwo/OtherProviderPopUp";
import StepsActions from "../StepsActions";
import { useState, useEffect } from "react";
import { emailAccountsApi } from "@/lib/api";
import { toast } from "sonner";

interface Step2EmailProfileProps {
  remoteContext: NewCopilotContext;
}

export default function Step2EmailProfile({
  remoteContext,
}: Step2EmailProfileProps) {
  const { copilotData, setStep, updateCopilotData } = useCopilotStore();
  const [showOtherProviderPopUp, setShowOtherProviderPopUp] = useState(false);
  const [selectedProfileName, setSelectedProfileName] = useState<string | null>(
    null,
  );

  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  useEffect(() => {
    const handleWindowClick = () => setOpenMenuId(null);
    if (openMenuId !== null) {
      window.addEventListener("click", handleWindowClick);
    }
    return () => window.removeEventListener("click", handleWindowClick);
  }, [openMenuId]);

  const fetchProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const res = await emailAccountsApi.getAll();
      console.log("Fetched profiles from API:", res.data);
      setUserProfiles(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      await emailAccountsApi.delete(id);
      if (copilotData.emailAccountId === id) {
        updateCopilotData({ emailAccountId: null });
      }
      fetchProfiles();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account");
    }
  };

  const handleClosePopup = (saved?: boolean) => {
    setShowOtherProviderPopUp(false);
    setEditingProfile(null);
    if (saved) {
      fetchProfiles();
    }
  };

  const canContinue =
    copilotData.emailAccountId !== null ||
    selectedProfileName === "gmail" ||
    selectedProfileName === "outlook";

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Connect your email account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose the email account your copilot will use to send emails.
          </p>
        </div>

        {/* Recommended section */}
        <div>
          <h3 className="text-xs font-semibold text-gray-800 mb-3">
            Recommended
          </h3>

          <div className="space-y-3">
            {/* Connect with Gmail - highlighted */}
            <button
              type="button"
              className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl border ${
                selectedProfileName === "gmail"
                  ? "border-primary bg-primary-light"
                  : "border-gray-200 hover:border-primary hover:bg-primary-light"
              } transition-colors text-left`}
              onClick={() => setSelectedProfileName("gmail")}
            >
              <div className="flex items-center gap-4">
                <Image src="/gmail.svg" alt="Gmail" width={40} height={40} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      Connect with Gmail
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-success bg-success/5 px-2 py-0.5 rounded-full">
                      <CheckCircle size={8} /> Recommended
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-primary bg-primary/5  px-2 py-0.5 rounded-full">
                      <Zap size={8} /> Easy setup
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your Gmail account with OAuth in a few clicks.
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </button>

            {/* Connect with Outlook */}
            <button
              type="button"
              className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl border ${
                selectedProfileName === "outlook"
                  ? "border-primary bg-primary-light"
                  : "border-gray-200 hover:border-primary hover:bg-primary-light"
              } transition-colors text-left`}
              onClick={() => setSelectedProfileName("outlook")}
            >
              <div className="flex items-center gap-4">
                <Image
                  src="/outlook.svg"
                  alt="Outlook"
                  width={40}
                  height={40}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      Connect with Outlook
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-success bg-success/5 px-2 py-0.5 rounded-full">
                      <CheckCircle size={8} /> Recommended
                    </span>
                    <span className="flex items-center gap-1 text-[8px] font-medium text-primary bg-primary/5  px-2 py-0.5 rounded-full">
                      <Zap size={8} /> Easy setup
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Connect your Outlook account with OAuth in a few clicks.
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-semibold text-gray-800">
              Other options
            </span>
          </div>
        </div>

        {/* Connect other provider */}
        <button
          type="button"
          onClick={() => {
            setShowOtherProviderPopUp(true);
            setSelectedProfileName("other");
          }}
          className={`w-full flex items-center justify-between gap-4 p-4 rounded-xl border ${
            selectedProfileName === "other"
              ? "border-primary bg-primary-light"
              : "border-gray-200 hover:border-primary hover:bg-primary-light"
          } transition-colors text-left`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200 shrink-0">
              <Inbox size={18} className="text-gray-500" />
            </div>
            <div>
              <span className="font-semibold text-sm text-gray-900">
                Connect other email provider
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Use SMTP / IMAP to connect any email provider.
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400 shrink-0" />
        </button>

        {/* Divider */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs font-semibold text-gray-800">
              Your Accounts
            </span>
          </div>
        </div>

        {/* User Created Accounts */}
        {!loadingProfiles && userProfiles.length > 0 && (
          <div className="mt-6">
            <div className="space-y-3">
              {userProfiles.map((profile) => (
                <div key={profile.id} className="flex gap-2 items-center">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-between gap-4 p-4 rounded-xl border ${
                      copilotData.emailAccountId === profile.id
                        ? "border-primary/20 bg-primary-light"
                        : "border-gray-200 hover:border-primary/20 hover:bg-primary/5"
                    } transition-colors text-left`}
                    onClick={() => {
                      updateCopilotData({ emailAccountId: profile.id });
                      console.log("copilotdata", copilotData);
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
                            {profile.profileName ||
                              profile.name ||
                              profile.email}
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
                          setOpenMenuId(
                            openMenuId === profile.id ? null : profile.id,
                          );
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
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditingProfile(profile);
                              setShowOtherProviderPopUp(true);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
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
        )}
      </div>

      {showOtherProviderPopUp && (
        <OtherProviderPopUp
          onClose={handleClosePopup}
          editProfile={editingProfile}
        />
      )}

      <StepsActions
        onPress={() => setStep(3)}
        isLoading={false}
        canContinue={canContinue}
      />
    </>
  );
}
