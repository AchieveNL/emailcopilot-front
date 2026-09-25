"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { flightSchedulesApi, copilotsApi } from "@/lib/api";
import FlightScheduleTable, {
  type FlightScheduleRow,
} from "@/components/layout/features/flightSchedule/FlightScheduleTable";
import FlightScheduleFormModal from "@/components/ui/flightSchedule/FlightScheduleFormModal";
import type { Schedule } from "@/components/ui/flightSchedule/FlightScheduleCard";
import DashboardHeader from "@/components/layout/DashboardHeader";
import DashboardContainer from "@/components/layout/DashboardContainer";
import Pagination from "@/components/ui/templates/Pagination";
import { useRowsPerPage } from "@/lib/hooks";

interface CopilotLite {
  id: number;
  flightScheduleId: number | null;
}

export default function FlightSchedulePage() {
  const perPage = useRowsPerPage(10);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [copilots, setCopilots] = useState<CopilotLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      const res = await flightSchedulesApi.getAll();
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load flight schedules.");
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCopilots = useCallback(async () => {
    try {
      const res = await copilotsApi.getAll();
      const list = Array.isArray(res.data) ? res.data : [];
      setCopilots(
        list.map((c: CopilotLite & Record<string, unknown>) => ({
          id: c.id,
          flightScheduleId: c.flightScheduleId ?? null,
        })),
      );
    } catch {
      setCopilots([]);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchCopilots();
  }, [fetchSchedules, fetchCopilots]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "true") {
      setIsModalOpen(true);
    }
  }, []);

  // ── Enrich: derive used-by counts from copilots ────────────────────────────

  const rows: FlightScheduleRow[] = useMemo(
    () =>
      schedules.map((s) => ({
        ...s,
        usedBy: copilots.filter((c) => c.flightScheduleId === s.id).length,
      })),
    [schedules, copilots],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((s) => s.name?.toLowerCase().includes(q));
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * perPage,
    safeCurrentPage * perPage,
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

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

  const handleDelete = async (schedule: Schedule) => {
    if (!schedule.id) return;
    if (!confirm("Are you sure you want to delete this flight schedule?"))
      return;
    try {
      await flightSchedulesApi.delete(schedule.id);
      toast.success("Flight schedule deleted.");
      fetchSchedules();
    } catch {
      toast.error("Failed to delete flight schedule.");
    }
  };

  // ── Duplicate (client-side — no API duplicate endpoint) ────────────────────

  const handleDuplicate = async (schedule: Schedule) => {
    try {
      await flightSchedulesApi.create({
        name: `${schedule.name || "Flight Schedule"} (Copy)`,
        sendLimit: schedule.sendLimit,
        sendLimitActive: schedule.sendLimitActive,
        activeDays: schedule.activeDays,
        sendingHours: schedule.sendingHours,
        sendingHoursActive: schedule.sendingHoursActive,
        timezone: schedule.timezone,
      });
      toast.success("Flight schedule duplicated.");
      fetchSchedules();
    } catch {
      toast.error("Failed to duplicate flight schedule.");
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

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <DashboardContainer>
      <DashboardHeader
        title="Flight Schedule"
        description="Control when your campaigns send emails."
        actionLabel="Create New Flight Schedule"
        onAction={openCreateModal}
      />

      {isModalOpen && (
        <FlightScheduleFormModal
          schedule={editingSchedule}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      <FlightScheduleTable
        schedules={paginated}
        filteredCount={filtered.length}
        search={search}
        onSearchChange={handleSearchChange}
        onEdit={openEditModal}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onCreateNew={openCreateModal}
        loading={loading}
      />

      {filtered.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </DashboardContainer>
  );
}
