/** Keep archived copilots last without mutating the API response or shared store. */
export function sortCopilotsArchivedLast<T extends { status?: string }>(
  copilots: readonly T[],
  compareWithinGroup?: (a: T, b: T) => number,
): T[] {
  return [...copilots].sort((a, b) => {
    const archivedOrder = Number(a.status === "archived") - Number(b.status === "archived");
    return archivedOrder || compareWithinGroup?.(a, b) || 0;
  });
}
