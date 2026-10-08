import { describe, expect, it } from "vitest";
import { selectMockQuest } from "./fixtures";
import type { Quest } from "./schema";
import { validateQuestSafety } from "./safety";

const base = selectMockQuest({ durationMinutes: 15, mood: "explore", environment: "city" });

function questWithInstruction(instruction: string): Quest {
  return { ...base, tasks: [{ ...base.tasks[0], instruction }, ...base.tasks.slice(1)] };
}

describe("deterministic quest safety", () => {
  it.each([
    ["trespassing", "Enter private property to find a hidden garden."],
    ["rail tracks", "Walk along the railway tracks."],
    ["traffic", "Step into moving traffic to compare car colors."],
    ["climbing", "Climb a wall to see the view."],
    ["water", "Wade into the river to find a stone."],
    ["abandoned building", "Explore an abandoned warehouse."],
    ["wildlife", "Approach a wild animal for a photo."],
    ["unknown plant", "Eat an unknown berry you find."],
    ["stranger", "Follow a stranger for five minutes."],
    ["night", "Explore the park after dark."],
    ["reduced awareness", "Close your eyes and listen for one minute."],
    ["exertion", "Sprint until exhaustion."],
    ["fire", "Build a fire beside the trail."],
  ])("rejects %s", (_name, instruction) => {
    expect(validateQuestSafety(questWithInstruction(instruction)).safe).toBe(false);
  });

  it("allows the benign curated quest", () => {
    expect(validateQuestSafety(base)).toEqual({ safe: true });
  });

  it("allows the curated fallback for every supported input", () => {
    for (const durationMinutes of [15, 30, 60] as const)
      for (const mood of ["explore", "relax", "move", "notice"] as const)
        for (const environment of ["city", "park", "anywhere"] as const) {
          expect(validateQuestSafety(selectMockQuest({ durationMinutes, mood, environment }))).toEqual({ safe: true });
        }
  });
});
