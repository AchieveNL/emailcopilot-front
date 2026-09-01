"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { targetAudiencesApi } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import TargetAudienceTable from "@/components/layout/features/targetaudience/targetAudienceTable";
import TargetAudienceForm from "@/components/layout/features/targetaudience/TargetAudienceForm";
import type { TargetAudience } from "@/../store/copilotStore";
import DashboardHeader from "@/components/layout/DashboardHeader";

export default function ScrapeProfilesPage() {
  const [profiles, setProfiles] = useState<TargetAudience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAudience, setEditingAudience] = useState<TargetAudience | null>(
    null,
  );
  const [runningId, setRunningId] = useState<number | null>(null);
  const [urlId, setUrlId] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const res = await targetAudiencesApi.getAll();
      console.log("Fetched profiles:", res.data);
      setProfiles(res.data);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRun(id: number) {
    try {
      setRunningId(id);
      await targetAudiencesApi.run(id);
      fetchProfiles();
    } catch {
      toast.error("Failed to run scrape.");
    } finally {
      setRunningId(null);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this Target Audience?")) return;
    try {
      await targetAudiencesApi.delete(id);
      fetchProfiles();
    } catch {
      toast.error("Failed to delete.");
    }
  }

  async function handleDuplicate(audience: TargetAudience) {
    try {
    
      await targetAudiencesApi.create({
        name: `${audience.name} (Copy)`,
        searchQuery: audience.searchQuery,
        country: audience.country || "",
        city: audience.city || "",
      });
      toast.success("Target Audience duplicated successfully.");
      fetchProfiles();
    } catch {
      toast.error("Failed to duplicate Target Audience.");
    }
  }
  async function handleEdit(audience: TargetAudience) {
    setEditingAudience(audience);
    setShowModal(true);
  }

  useEffect(() => {
    if (!window.location.hash || profiles.length === 0) return;

    const elementId = window.location.hash.substring(1);
    setUrlId(elementId);

    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const timeout = setTimeout(() => {
      setUrlId("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [profiles]);

  return (
    <div className="p-5 w-full mx-auto">
        <DashboardHeader
          title="Target Audience"
          description="Configure web scraping sources for your leads."
          actionLabel="Create New Target Audience"
        
  mobileActionLabel = "Add"
          onAction={() => {
            setEditingAudience(null);
            setShowModal(true);
          }}
        />

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : (
        <TargetAudienceTable
          targetAudiences={profiles}
          onEdit={handleEdit}
          onDelete={(audience) => handleDelete(audience.id)}
          onDuplicate={handleDuplicate}
        />
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <TargetAudienceForm
            initialData={editingAudience}
            onCancel={() => {
              setShowModal(false);
              setEditingAudience(null);
            }}
            onSuccess={() => {
              setShowModal(false);
              setEditingAudience(null);
              fetchProfiles();
            }}
          />
        </div>
      )}
    </div>
  );
}
