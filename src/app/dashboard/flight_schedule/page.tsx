"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { flightSchedulesApi } from "@/lib/api";
import FlightScheduleCard from "@/components/ui/flightSchedule/FlightScheduleCard";
import FlightScheduleFormModal from "@/components/ui/flightSchedule/FlightScheduleFormModal";
import type { Schedule } from "@/components/ui/flightSchedule/FlightScheduleCard";
import {
  SearchAndFilter,
  type SortOrder,
} from "@/components/ui/SearchAndFilter";
import DashboardHeader from "@/components/layout/DashboardHeader";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlightSchedulePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const res = await flightSchedulesApi.getAll();
      setSchedules(res.data);
    } catch {
      toast.error("Failed to load flight schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // ── Create / Update ────────────────────────────────────────────────────────

  const handleSave = async (data: Omit<Schedule, "id">) => {
    if (editingSchedule?.id) {
      await flightSchedulesApi.update(editingSchedule.id, data);
      toast.success("Flight schedule updated.");
    } else {
      await flightSchedulesApi.create(data);
      toast.success("Flight schedule created.");
    }
    closeModal();
    fetchSchedules();
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this flight schedule?"))
      return;
    try {
      await flightSchedulesApi.delete(id);
      toast.success("Flight schedule deleted.");
      fetchSchedules();
    } catch {
      toast.error("Failed to delete flight schedule.");
    }
  };

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openCreateModal = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  // ── Filtering and Sorting ──────────────────────────────────────────────────

  const filteredSchedules = useMemo(() => {
    return schedules
      .filter((s) => {
        if (!searchQuery) return true;
        return s.name?.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => {
        // Fallback to ID if createdAt is missing
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id || 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id || 0;

        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
  }, [schedules, searchQuery, sortOrder]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-5 w-full mx-auto">
      {/* Header */}
      <DashboardHeader
        title="Flight Schedule"
        description="Manage your flight schedules."
        actionLabel="New Flight Schedule"
        onAction={openCreateModal}
      />

      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        placeholder="Search flight schedules..."
      />

      {/* Modal */}
      {isModalOpen && (
        <FlightScheduleFormModal
          schedule={editingSchedule}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {/* Content */}
      {loading ? (
        <div className="min-h-120 flex items-center justify-center text-gray-400">
          <Loader2 size={24} className="animate-spin" />
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="min-h-120 flex flex-col items-center justify-center p-12 text-center">
          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Calendar size={20} className="text-primary" />
          </div>
          <h2 className="font-bold text-gray-900 mb-2">
            No flight schedules found
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            {searchQuery
              ? "We couldn't find any flight schedules matching your search."
              : "Flight schedules will appear here once created."}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="btn btn-main btn-cta flex items-center gap-2"
            >
              <Plus size={15} />
              New Flight Schedule
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <div key={schedule.id}>
              <FlightScheduleCard
                schedules={schedule}
                showEditAndDeleteButton={true}
                onEdit={() => openEditModal(schedule)}
                onDelete={() => schedule.id && handleDelete(schedule.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
