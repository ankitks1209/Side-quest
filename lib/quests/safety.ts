import type { Quest } from "./schema";

export type SafetyResult = { safe: true } | { safe: false; reasons: string[] };

const SAFETY_RULES: ReadonlyArray<{ reason: string; pattern: RegExp }> = [
  { reason: "trespassing or private property", pattern: /\b(?:trespass\w*|private\s+propert(?:y|ies)|restricted\s+(?:area|property))\b/i },
  { reason: "construction zone", pattern: /\bconstruction\s+(?:site|zone)\b/i },
  { reason: "rail tracks", pattern: /\b(?:rail(?:way)?|train)\s+tracks?\b/i },
  { reason: "unsafe traffic interaction", pattern: /\b(?:walk|step|run|stand|move)\s+(?:into|through|among)\s+(?:moving\s+)?traffic\b|\bdodge\s+(?:cars|traffic)\b/i },
  { reason: "dangerous road crossing", pattern: /\bcross\s+(?:a\s+)?(?:highway|motorway|freeway|busy\s+road)(?:\s+without\s+(?:a\s+)?crosswalk)?\b/i },
  { reason: "climbing or unsafe height", pattern: /\b(?:climb\w*|rooftop|roof\s+edge|high\s+ledge|cliff\s+edge)\b/i },
  { reason: "entering water", pattern: /\b(?:enter|wade|swim|dive|jump)\w*\s+(?:in|into|across)\s+(?:the\s+)?(?:water|river|lake|pond|ocean|sea)\b/i },
  { reason: "abandoned building", pattern: /\babandoned\s+(?:building|house|factory|warehouse|structure)\b/i },
  { reason: "wildlife interaction", pattern: /\b(?:approach|touch|handle|feed|chase|catch)\w*\s+(?:a\s+|the\s+)?(?:wildlife|wild\s+animal|animal|bird|snake)\b/i },
  { reason: "unknown plant or fungi contact", pattern: /\b(?:touch|pick|handle|taste|eat|consume)\w*\s+(?:an?\s+|the\s+)?(?:unknown|unidentified)\s+(?:plant|berry|berries|mushroom|fungus|fungi)\b/i },
  { reason: "following strangers", pattern: /\bfollow\w*\s+(?:a\s+|the\s+)?stranger\b/i },
  { reason: "dangerous night exploration", pattern: /\b(?:explore|wander|walk|hike)\w*\b.{0,35}\b(?:at\s+night|after\s+dark)\b|\b(?:at\s+night|after\s+dark)\b.{0,35}\b(?:explore|wander|walk|hike)\w*\b/i },
  { reason: "reduced awareness outdoors", pattern: /\bclose\s+(?:both\s+)?(?:your\s+)?eyes\b/i },
  { reason: "extreme physical exertion", pattern: /\b(?:sprint|run|exercise|push)\w*\s+(?:until|to)\s+(?:exhaustion|collapse|failure)|\bextreme\s+(?:exercise|workout|exertion)\b/i },
  { reason: "illegal activity", pattern: /\b(?:illegal\s+activit(?:y|ies)|break\s+(?:a\s+|the\s+)?law|steal\w*|vandal(?:ize|ism))\b/i },
  { reason: "fire, weapon, or dangerous tool", pattern: /\b(?:start|build|light)\s+(?:a\s+)?fire\b|\b(?:weapon|gun|knife|machete|chainsaw|power\s+tool)s?\b/i },
];

function questSafetyText(quest: Quest): string {
  return [
    quest.title,
    quest.intro,
    ...quest.tasks.flatMap((task) => [task.instruction, task.verificationCriterion ?? ""]),
  ].join("\n");
}

export function validateQuestSafety(quest: Quest): SafetyResult {
  const text = questSafetyText(quest);
  const reasons = SAFETY_RULES
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => rule.reason);
  return reasons.length === 0 ? { safe: true } : { safe: false, reasons };
}
