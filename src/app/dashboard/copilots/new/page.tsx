"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreVertical, ChevronRight, ShieldCheck, Save, Loader2, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Stepper from "@/components/ui/Stepper";
import CopilotSummary from "@/components/ui/CopilotSummary";
import Step1Settings from "@/components/ui/Step1Settings";
import Step2EmailProfile from "@/components/ui/Step2EmailProfile";
import Step3ScrapeProfile from "@/components/ui/Step3ScrapeProfile";
import Step4Launch from "@/components/ui/Step4Launch";
import { useCopilotStore } from "@/store/copilotStore";
import { copilotsApi, emailProfilesApi, scrapeProfilesApi, templatesApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";

// RemoteOption IDs are numbers — matches serial PKs in schema
type RemoteOption = { id: number; name: string };

export type NewCopilotContext = {
  emailProfiles: RemoteOption[];
  scrapeProfiles: RemoteOption[];
  templates: RemoteOption[];
  loadingOptions: boolean;
};

export default function NewCopilotPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentStep, copilotData, resetStore, mode, setMode, setEditingId, loadCopilot } = useCopilotStore();

  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [loadingCopilot, setLoadingCopilot] = useState(false);

  // Remote options for step dropdowns
  const [emailProfiles, setEmailProfiles] = useState<RemoteOption[]>([]);
  const [scrapeProfiles, setScrapeProfiles] = useState<RemoteOption[]>([]);
  const [templates, setTemplates] = useState<RemoteOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const { user } = useUser()

  // Load dropdown options once on mount
  useEffect(() => {
    async function loadOptions() {
      try {
        setLoadingOptions(true);
        const [ep, sp, tp] = await Promise.all([
          emailProfilesApi.getAll(),
          scrapeProfilesApi.getAll(),
          templatesApi.getAll(),
        ]);
        // id is number (serial PK), name is varchar — matches schema
        setEmailProfiles(
          ep.data.map((e: { id: number; profileName: string }) => ({ id: e.id, name: e.profileName }))
        );
        setScrapeProfiles(
          sp.data.map((s: { id: number; name: string }) => ({ id: s.id, name: s.name }))
        );
        setTemplates(
          tp.data.map((t: { id: number; name: string }) => ({ id: t.id, name: t.name }))
        );
      } catch {
        // Non-blocking — steps degrade gracefully
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    const duplicateId = searchParams.get("duplicate");

    if (editId) {
      const id = parseInt(editId, 10);
      setLoadingCopilot(true);
      copilotsApi.getById(id)
        .then((res) => {
          const copilot = res.data;
          loadCopilot({
            name: copilot.name,
            description: copilot.description,
            emailProfileId: copilot.emailProfileId,
            scrapeProfileId: copilot.scrapeProfileId,
            templateId: copilot.templateId,
            settings: copilot.settings || {
              dailyLimit: 100,
              sendingSpeed: "Normal (Recommended)",
              timezone: "(GMT-08:00) Pacific Time (US & Canada)",
            },
          }, id, "edit");
          setDraftId(id);
        })
        .catch(() => {
          alert("Failed to load copilot. Please try again.");
          router.push("/dashboard/copilots");
        })
        .finally(() => setLoadingCopilot(false));
    } else if (duplicateId) {
      const id = parseInt(duplicateId, 10);
      setLoadingCopilot(true);
      copilotsApi.getById(id)
        .then((res) => {
          const copilot = res.data;
          loadCopilot({
            name: `Copy of ${copilot.name}`,
            description: copilot.description,
            emailProfileId: copilot.emailProfileId,
            scrapeProfileId: copilot.scrapeProfileId,
            templateId: copilot.templateId,
            settings: copilot.settings || {
              dailyLimit: 100,
              sendingSpeed: "Normal (Recommended)",
              timezone: "(GMT-08:00) Pacific Time (US & Canada)",
            },
          }, undefined, "duplicate");
        })
        .catch(() => {
          alert("Failed to load copilot. Please try again.");
          router.push("/dashboard/copilots");
        })
        .finally(() => setLoadingCopilot(false));
    }
  }, [searchParams, router, loadCopilot]);

  const getPageTitle = () => {
    if (mode === "edit") return "Edit Copilot";
    if (mode === "duplicate") return "Duplicate Copilot";
    return "Create New Copilot";
  };

  const handleSaveDraft = useCallback(async () => {
    try {
      setSavingDraft(true);
      const payload = {
        ...copilotData,
        status: "draft" as const,
      };

      let res;
      if (mode === "edit" && draftId) {
        res = await copilotsApi.update(draftId, payload);
      } else {
        res = await copilotsApi.create(payload);
        if (mode === "edit") {
          setDraftId(res.data.id);
        }
      }

      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    } catch {
      alert("Failed to save draft. Please try again.");
    } finally {
      setSavingDraft(false);
    }
  }, [copilotData, draftId, mode]);

  const handleLaunch = useCallback(async () => {
    try {
      setLaunching(true);
      const payload = { ...copilotData, userId: user?.id, status: "active" as const };

      if (mode === "edit" && draftId) {
        await copilotsApi.update(draftId, payload);
        await copilotsApi.updateStatus(draftId, "active");
      } else {
        await copilotsApi.create(payload);
      }

      resetStore();
      router.push("/dashboard/copilots");
    } catch {
      alert("Failed to launch copilot. Please try again.");
    } finally {
      setLaunching(false);
    }
  }, [copilotData, draftId, router, resetStore, mode]);

  const remoteContext: NewCopilotContext = {
    emailProfiles,
    scrapeProfiles,
    templates,
    loadingOptions,
  };

  if (loadingCopilot) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading copilot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold mb-1">
            <Link href="/dashboard/copilots" className="text-gray-400 hover:text-gray-600 transition-colors">
              Copilots
            </Link>
            <ChevronRight size={16} className="text-gray-300" />
            <span className="text-gray-900">{getPageTitle()}</span>
          </div>
          <p className="text-gray-500 text-sm">
            Build your copilot in a few simple steps and start sending personalized emails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={savingDraft}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {savingDraft ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            {draftSaved ? "Saved!" : savingDraft ? "Saving..." : "Save Draft"}
          </button>

          {/* Kebab — discard */}
          <div className="relative group">
            <button className="w-9 h-9 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
              <MoreVertical size={16} className="text-gray-500" />
            </button>
            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg w-44 py-1 hidden group-hover:block z-10">
              <button
                onClick={() => {
                  resetStore();
                  router.push("/dashboard/copilots");
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                Discard &amp; exit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stepper */}
      <Stepper />

      {/* Content grid */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Main form */}
        <div className="col-span-2">
          {currentStep === 1 && <Step1Settings />}
          {currentStep === 2 && <Step2EmailProfile remoteContext={remoteContext} />}
          {currentStep === 3 && <Step3ScrapeProfile remoteContext={remoteContext} />}
          {currentStep === 4 && (
            <Step4Launch
              remoteContext={remoteContext}
              onLaunch={handleLaunch}
              launching={launching}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="col-span-1 space-y-5">
          <CopilotSummary
            emailProfiles={emailProfiles}
            scrapeProfiles={scrapeProfiles}
            templates={templates}
          />

          {/* Draft status card */}
          {draftId && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-900 mb-0.5">Draft saved</p>
              <p className="text-xs text-gray-400">
                Your progress is saved. Come back anytime to finish.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer banner */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
            <ShieldCheck size={18} className="text-gray-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Safe &amp; Compliant Outreach</h3>
            <p className="text-xs text-gray-500">
              We follow best practices to keep your sending safe and your account healthy.
            </p>
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}