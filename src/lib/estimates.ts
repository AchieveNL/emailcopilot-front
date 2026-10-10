export interface EstimateScheduleSeed {
  sendLimit?: number | null;
  activeDays?: number[] | null;
}

export function estimateAudienceSize(
  flightSchedule: EstimateScheduleSeed | null | undefined,
  targetAudienceId: number | null | undefined,
  copilotName: string | null | undefined,
): number {
  return (
    400 +
    (((flightSchedule?.sendLimit ?? 30) *
      (flightSchedule?.activeDays?.length ?? 5) +
      (targetAudienceId ?? 0) * 37 +
      (copilotName?.length ?? 7) * 11) %
      4600)
  );
}
