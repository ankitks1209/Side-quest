import { QuestSummarySchema, type Quest, type QuestSession, type QuestSummary, type VerificationResult } from "../quests/schema";
import { ActiveSessionRecordSchema, type ActiveSessionRecord } from "./schema";

function safeElapsed(startedAt: number, now: number): number {
  return Math.max(0, now - startedAt);
}

export function startQuestSession(quest: Quest, now: number, documentVisible: boolean): ActiveSessionRecord {
  return ActiveSessionRecordSchema.parse({
    version: 1,
    quest,
    questSession: {
      questId: quest.id,
      startedAt: now,
      activeScreenMs: 0,
      completedTaskIds: [],
      verificationResults: {},
    },
    phase: "active",
    visibleSegmentStartedAt: documentVisible ? now : null,
  });
}

export function startVisibleSegment(record: ActiveSessionRecord, now: number): ActiveSessionRecord {
  if (record.visibleSegmentStartedAt !== null) return record;
  return { ...record, visibleSegmentStartedAt: now };
}

export function flushVisibleSegment(record: ActiveSessionRecord, now: number): ActiveSessionRecord {
  if (record.visibleSegmentStartedAt === null) return record;
  return {
    ...record,
    questSession: {
      ...record.questSession,
      activeScreenMs: record.questSession.activeScreenMs + safeElapsed(record.visibleSegmentStartedAt, now),
    },
    visibleSegmentStartedAt: null,
  };
}

export function restoreActiveSession(record: ActiveSessionRecord, now: number, documentVisible: boolean): ActiveSessionRecord {
  // An unfinished segment has unknown visibility after an interrupted page, so never add its gap.
  const restored = { ...record, visibleSegmentStartedAt: null };
  return documentVisible ? startVisibleSegment(restored, now) : restored;
}

export function enterEvidence(record: ActiveSessionRecord): ActiveSessionRecord {
  return { ...record, phase: "evidence" };
}

export function updateEvidenceProgress(
  record: ActiveSessionRecord,
  completedTaskIds: string[],
  photoTaskId: string,
  verificationResult: VerificationResult | null,
): ActiveSessionRecord {
  const verificationResults = { ...record.questSession.verificationResults };
  if (verificationResult) verificationResults[photoTaskId] = verificationResult;
  else delete verificationResults[photoTaskId];
  return {
    ...record,
    questSession: { ...record.questSession, completedTaskIds, verificationResults },
  };
}

export function completeQuestSession(
  record: ActiveSessionRecord,
  now: number,
  completedTaskIds: string[],
  photoTaskId: string,
  verificationResult: VerificationResult | null,
): { summary: QuestSummary; session: QuestSession } {
  const progressed = updateEvidenceProgress(record, completedTaskIds, photoTaskId, verificationResult);
  const flushed = flushVisibleSegment(progressed, now);
  const totalDurationMs = safeElapsed(flushed.questSession.startedAt, now);
  const activeScreenMs = Math.min(totalDurationMs, Math.max(0, flushed.questSession.activeScreenMs));
  const estimatedAwayMs = totalDurationMs - activeScreenMs;
  const summary = QuestSummarySchema.parse({
    totalDurationMs,
    activeScreenMs,
    estimatedAwayMs,
    awayRatio: totalDurationMs === 0 ? 0 : estimatedAwayMs / totalDurationMs,
    completedTasks: completedTaskIds.length,
  });
  return {
    summary,
    session: { ...flushed.questSession, completedAt: now, activeScreenMs, completedTaskIds },
  };
}
