"use client";

import { useState, useEffect, useCallback } from "react";
import { MoreVertical, ChevronRight, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Stepper from "@/components/ui/NewCopilot/Stepper";
import CopilotSummary from "@/components/ui/NewCopilot/StepOne/CopilotSummary";
import EmailProfileSidebar from "@/components/ui/NewCopilot/StepTwo/EmailProfileSidebar";
import Step1Settings from "@/components/ui/NewCopilot/StepOne/Step1Settings";
import Step2EmailProfile from "@/components/ui/NewCopilot/StepTwo/Step2EmailProfile";
import Step3ScrapeProfile from "@/components/ui/NewCopilot/StepThree/Step3ScrapeProfile";
import Step4Launch from "@/components/ui/NewCopilot/StepSix/Step4Launch";
import TargetAudienceSummary from "@/components/ui/NewCopilot/StepThree/TargetAudienceSummary";
import { useCopilotStore } from "@/store/copilotStore";
import EmailTemplateStep from "@/components/ui/NewCopilot/StepFour/EmailTemplateStep";
import {
  copilotsApi,
  emailProfilesApi,
  scrapeProfilesApi,
  templatesApi,
} from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import CopilotFooter from "@/components/ui/NewCopilot/CopilotFooter";
import EmailTemplateSidbar from "@/components/ui/NewCopilot/StepFour/EmailTemplateSidbar";
import ScheduleStep from "@/components/ui/NewCopilot/StepFive/ScheduleStep";
import ScheduleSideBar from "@/components/ui/NewCopilot/StepFive/ScheduleSideBar";
import LaunchSideBar from "@/components/ui/NewCopilot/StepSix/LaunchSideBar";
import { toast } from "sonner";

// RemoteOption IDs are numbers — matches serial PKs in schema
type RemoteOption = { id: number; name: string };

export type NewCopilotContext = {
  emailProfiles: RemoteOption[];
  scrapeProfiles: RemoteOption[];
  templates: RemoteOption[];
  loadingOptions: boolean;
};

export default function NewCopilotPage() {
  const defaultTimezone = "Europe/Brussels";
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentStep,
    copilotData,
    resetStore,
    mode,

    loadCopilot,
  } = useCopilotStore();

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

  const { user } = useUser();

  // Define steps with their respective components and sidebar content
  const STEPS = [
    {
      id: 1,
      component: () => <Step1Settings />,
      sideBar: () => (
        <CopilotSummary draftId={draftId?.toString() ?? undefined} />
      ),
    },
    {
      id: 2,
      component: () => <Step2EmailProfile remoteContext={remoteContext} />,
      sideBar: () => <EmailProfileSidebar />,
    },
    {
      id: 3,
      component: () => <Step3ScrapeProfile />,
      sideBar: () => <TargetAudienceSummary />,
    },
    {
      id: 4,
      component: () => <EmailTemplateStep />,
      sideBar: () => <EmailTemplateSidbar />,
    },
    {
      id: 5,
      component: () => <ScheduleStep />,
      sideBar: () => <ScheduleSideBar />,
    },
    {
      id: 6,
      component: () => (
        <Step4Launch
          remoteContext={remoteContext}
          onLaunch={handleLaunch}
          launching={launching}
        />
      ),
      sideBar: () => (
        <LaunchSideBar
          draftId={draftId?.toString() ?? undefined}
          remoteContext={remoteContext}
        />
      ),
    },
  ];

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
          ep.data.map((e: { id: number; profileName: string }) => ({
            id: e.id,
            name: e.profileName,
          })),
        );
        setScrapeProfiles(
          sp.data.map((s: { id: number; name: string }) => ({
            id: s.id,
            name: s.name,
          })),
        );
        setTemplates(
          tp.data.map((t: { id: number; name: string }) => ({
            id: t.id,
            name: t.name,
          })),
        );
      } catch {
        // Non-blocking — steps degrade gracefully
      } finally {
        setLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  // show alert when user tries to leave the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();

      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  useEffect(() => {
    const editId = searchParams.get("edit");
    const duplicateId = searchParams.get("duplicate");

    if (editId) {
      const id = parseInt(editId, 10);
      setLoadingCopilot(true);
      copilotsApi
        .getById(id)
        .then((res) => {
          const copilot = res.data;
          loadCopilot(
            {
              name: copilot.name,
              description: copilot.description,
              goal: copilot.goal,
              emailProfileId: copilot.emailProfileId,
              scrapeProfileId: copilot.scrapeProfileId,
              templateId: copilot.templateId,
              sendLimit: copilot.sendLimit || 10,
              settings: copilot.settings || {
                schedule: {
                  runAt: "",
                },
                sendingSpeed: "Normal (Recommended)",
                timezone: defaultTimezone,
              },
              targetProfile: copilot.targetProfile || {
                industries: [],
                countries: [],
                cities: [],
              },
            },
            id,
            "edit",
          );
          setDraftId(id);
        })
        .catch(() => {
          toast.error("Failed to load copilot. Please try again.");
          router.push("/dashboard/copilots");
        })
        .finally(() => setLoadingCopilot(false));
    } else if (duplicateId) {
      const id = parseInt(duplicateId, 10);
      setLoadingCopilot(true);
      copilotsApi
        .getById(id)
        .then((res) => {
          const copilot = res.data;
          loadCopilot(
            {
              name: `Copy of ${copilot.name}`,
              description: copilot.description,
              goal: copilot.goal,
              emailProfileId: copilot.emailProfileId,
              scrapeProfileId: copilot.scrapeProfileId,
              templateId: copilot.templateId,
              sendLimit: copilot.sendLimit || 10,
              settings: copilot.settings || {
                schedule: {
                  runAt: "",
                },
                sendingSpeed: "Normal (Recommended)",
                timezone: defaultTimezone,
              },
              targetProfile: copilot.targetProfile || {
                industries: [],
                countries: [],
                cities: [],
              },
            },
            undefined,
            "duplicate",
          );
        })
        .catch(() => {
          toast.error("Failed to load copilot. Please try again.");
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
        name: copilotData.name,
        description: copilotData.description,
        goal: copilotData.goal,
        emailProfileId: copilotData.emailProfileId,
        scrapeProfileId: copilotData.scrapeProfileId,
        templateId: copilotData.templateId,
        sendLimit: copilotData.sendLimit,

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
      toast.error("Failed to save draft. Please try again.");
    } finally {
      setSavingDraft(false);
    }
  }, [copilotData, draftId, mode]);

  const handleLaunch = useCallback(async () => {
    try {
      setLaunching(true);
      const payload = {
        name: copilotData.name,
        description: copilotData.description,
        goal: copilotData.goal,
        emailProfileId: copilotData.emailProfileId,
        scrapeProfileId: copilotData.scrapeProfileId,
        templateId: copilotData.templateId,
        sendLimit: copilotData.sendLimit,

        userId: user?.id,
        status: "active" as const,
      };

      if (mode === "edit" && draftId) {
        await copilotsApi.update(draftId, payload);
        await copilotsApi.updateStatus(draftId, "active");
      } else {
        await copilotsApi.create(payload);
      }

      resetStore();
      router.push("/dashboard/copilots");
    } catch {
      toast.error("Failed to launch copilot. Please try again.");
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
      <div className="py-8 px-4 w-full mx-auto flex items-center justify-center min-h-100">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
          <span>Loading copilot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 w-full mx-auto">
      {/* Header */}
      <header className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center mb-4 gap-2 text-sm font-medium ">
            <Link
              href="/dashboard/copilots"
              className="text-primary hover:text-gray-600 text-sm lg:text-base transition-colors"
            >
              Copilots
            </Link>
            <ChevronRight size={16} className="text-primary" />
            <span className="text-primary">{getPageTitle()}</span>
          </div>

          <p className="text-gray-800 text-sm lg:text-lg font-bold">
            Create New Copilot
          </p>
          <p className="text-gray-500 text-xs lg:text-sm">
            Build your outbound copilot in 6 simple steps.
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
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-4  gap-6 mt-6">
        {/* Main form */}
        <div className="col-span-1 lg:col-span-4 xl:col-span-3 ">
          <div className="bg-white border border-gray-200 rounded-xl p-6 ">
            {STEPS[currentStep - 1].component()}
          </div>
          {/* Footer banner */}
          <CopilotFooter />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:flex lg:col-span-2 xl:col-span-1 space-y-5 h-fit bg-white border border-gray-200 rounded-xl p-4 ">
          {STEPS[currentStep - 1].sideBar()}
        </div>
      </div>
    </div>
  );
}
