import type { EvidenceCompletionStatus } from "./schema";

export function createCompletedTaskIds(
  photoTaskId: string,
  selfReportedTaskIds: string[],
  evidenceStatus: EvidenceCompletionStatus,
): string[] {
  return evidenceStatus === "verified"
    ? [photoTaskId, ...selfReportedTaskIds]
    : selfReportedTaskIds;
}
