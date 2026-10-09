import { describe, expect, it } from "vitest";
import { mockQuests } from "../quests/fixtures";
import { completeQuestSession, enterEvidence, flushVisibleSegment, restoreActiveSession, startQuestSession, startVisibleSegment, updateEvidenceProgress } from "./timing";

const quest = mockQuests[0];
const photoTask = quest.tasks.find((task) => task.verificationRequired)!;
const result = { verified: true, confidence: 0.9, reason: "Visible evidence matches." };

describe("quest session timing", () => {
  it("starts exactly at Begin with no accumulated time", () => {
    const session = startQuestSession(quest, 1_000, true);
    expect(session.questSession).toMatchObject({ startedAt: 1_000, activeScreenMs: 0 });
    expect(session.visibleSegmentStartedAt).toBe(1_000);
  });

  it("sums visible segments without double counting repeated events", () => {
    let session = startQuestSession(quest, 1_000, true);
    session = startVisibleSegment(session, 1_500);
    session = flushVisibleSegment(session, 2_000);
    session = flushVisibleSegment(session, 2_500);
    session = startVisibleSegment(session, 3_000);
    session = startVisibleSegment(session, 3_500);
    session = flushVisibleSegment(session, 4_000);
    expect(session.questSession.activeScreenMs).toBe(2_000);
  });

  it("includes evidence and verification latency in elapsed time without capping planned duration", () => {
    let session = startQuestSession(quest, 0, true);
    session = enterEvidence(flushVisibleSegment(session, 1_000));
    session = startVisibleSegment(session, 1_000_000);
    const completed = completeQuestSession(session, 1_400_000, [photoTask.id], photoTask.id, result);
    expect(completed.summary).toEqual({
      totalDurationMs: 1_400_000,
      activeScreenMs: 401_000,
      estimatedAwayMs: 999_000,
      awayRatio: 999_000 / 1_400_000,
      completedTasks: 1,
    });
    expect(completed.session.completedAt).toBe(1_400_000);
    expect(completed.session.verificationResults[photoTask.id]).toEqual(result);
    expect(completed.summary.totalDurationMs).toBeGreaterThan(quest.durationMinutes * 60_000);
  });

  it("clamps active time and handles a zero-duration session", () => {
    const session = startQuestSession(quest, 5_000, false);
    session.questSession.activeScreenMs = 99_000;
    const completed = completeQuestSession(session, 5_000, [], photoTask.id, null);
    expect(completed.summary).toMatchObject({ totalDurationMs: 0, activeScreenMs: 0, estimatedAwayMs: 0, awayRatio: 0 });
  });

  it("permits a zero Away Ratio when SideQuest stays visible", () => {
    const session = startQuestSession(quest, 1_000, true);
    const completed = completeQuestSession(session, 11_000, [], photoTask.id, null);
    expect(completed.summary).toMatchObject({ totalDurationMs: 10_000, activeScreenMs: 10_000, estimatedAwayMs: 0, awayRatio: 0 });
  });

  it("restores conservatively without adding an interrupted visible gap", () => {
    const interrupted = { ...startQuestSession(quest, 1_000, true), questSession: { ...startQuestSession(quest, 1_000, true).questSession, activeScreenMs: 500 } };
    const visible = restoreActiveSession(interrupted, 10_000, true);
    expect(visible.questSession.activeScreenMs).toBe(500);
    expect(visible.visibleSegmentStartedAt).toBe(10_000);
    const hidden = restoreActiveSession(interrupted, 10_000, false);
    expect(hidden.questSession.activeScreenMs).toBe(500);
    expect(hidden.visibleSegmentStartedAt).toBeNull();
  });

  it("persists evidence phase, self reports and durable results without image data", () => {
    let session = enterEvidence(startQuestSession(quest, 1_000, true));
    session = updateEvidenceProgress(session, [quest.tasks[1].id], photoTask.id, result);
    expect(session.phase).toBe("evidence");
    expect(session.questSession.completedTaskIds).toEqual([quest.tasks[1].id]);
    expect(session.questSession.verificationResults[photoTask.id]).toEqual(result);
    expect(JSON.stringify(session)).not.toMatch(/imageBytes|objectURL|blob:/i);
    expect(updateEvidenceProgress(session, [], photoTask.id, null).questSession.verificationResults).toEqual({});
  });
});
