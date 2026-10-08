import { QuestInputSchema, QuestSchema, type QuestInput } from "./schema";

export const mockQuests = [
  QuestSchema.parse({
    id: "nature-fights-back", title: "Nature Fights Back", durationMinutes: 15,
    mood: "explore", environment: "city",
    intro: "Even in the busiest streets, the wild finds a way. Look for the little things growing in plain sight.",
    tasks: [
      { id: "nature-photo", primitive: "PHOTO_OBJECT", instruction: "From a public footpath, photograph a small patch of green growing beside the pavement. Stay on the path; leave it untouched.", verificationRequired: true, verificationCriterion: "A plant or patch of greenery visible beside pavement." },
      { id: "nature-colors", primitive: "OBSERVE_COLOR", instruction: "Find two different shades of green along the same safe path. Notice how the light changes them.", verificationRequired: false },
      { id: "nature-reflect", primitive: "REFLECT", instruction: "Pause somewhere safe. What tiny detail would you have walked past yesterday? Keep it in mind.", verificationRequired: false },
    ],
  }),
  QuestSchema.parse({
    id: "five-quiet-things", title: "Five Quiet Things", durationMinutes: 15,
    mood: "relax", environment: "anywhere",
    intro: "No destination. Nothing to chase. Just a small pocket of time to notice what is already around you.",
    tasks: [
      { id: "quiet-photo", primitive: "PHOTO_OBJECT", instruction: "In a safe public place, photograph one ordinary object that feels peaceful: a bench, a leaf on the ground, or a patch of sky.", verificationRequired: true, verificationCriterion: "An ordinary outdoor object or patch of sky, without needing identifiable people." },
      { id: "quiet-listen", primitive: "LISTEN", instruction: "Rest on a safe public path or bench. Listen for three different sounds without moving toward them.", verificationRequired: false },
      { id: "quiet-reflect", primitive: "REFLECT", instruction: "Notice one texture without touching it. With your photo and three sounds, that makes five quiet things. Take one easy breath.", verificationRequired: false },
    ],
  }),
  QuestSchema.parse({
    id: "patterns-you-usually-miss", title: "Patterns You Usually Miss", durationMinutes: 15,
    mood: "notice", environment: "park",
    intro: "The park has its own quiet geometry. Slow down and find the repetitions hiding in everyday things.",
    tasks: [
      { id: "pattern-photo", primitive: "OBSERVE_PATTERN", instruction: "From a marked public path, photograph a repeating pattern: shadows, paving stones, or leaves. Observe plants without touching them.", verificationRequired: true, verificationCriterion: "A visible repeating pattern in shadows, paving, or leaves." },
      { id: "pattern-compare", primitive: "COMPARE", instruction: "Compare two nearby textures from the path. Which looks more regular? Which has more surprises? No touching needed.", verificationRequired: false },
      { id: "pattern-color", primitive: "OBSERVE_COLOR", instruction: "Look for a color that appears in three different places. Let your eyes wander while your feet stay somewhere safe.", verificationRequired: false },
    ],
  }),
];

export const DEFAULT_INPUT: QuestInput = { durationMinutes: 15, mood: "explore", environment: "city" };

// Adapt curated content instead of mislabeling a city-only quest as a park quest.
export function selectMockQuest(rawInput: QuestInput) {
  const input = QuestInputSchema.parse(rawInput);
  const fixture = input.mood === "relax" ? mockQuests[1]
    : input.mood === "notice" ? mockQuests[2] : mockQuests[0];
  const place = input.environment === "city" ? "public footpath"
    : input.environment === "park" ? "marked public park path" : "safe public outdoor path";
  const intro = input.mood === "relax" ? fixture.intro
    : input.mood === "notice" ? "The outdoors has its own quiet geometry. Slow down and find the repetitions hiding in everyday things."
    : input.mood === "move" ? "Take an easy walk and notice the greenery along the way. A fresh perspective is closer than you think."
    : input.environment === "city" ? fixture.intro
    : "Even along familiar paths, the wild finds a way. Look for the little things growing in plain sight.";
  let tasks = fixture.tasks;
  if (input.mood === "explore" || input.mood === "move") {
    tasks = [
      { ...fixture.tasks[0], instruction: `From a ${place}, photograph a small patch of greenery. Stay on the path and leave plants untouched.`, verificationCriterion: "An outdoor plant or patch of greenery photographed from a safe path." },
      input.mood === "move"
        ? { id: "comfortable-walk", primitive: "WALK_DURATION" as const, instruction: `Walk comfortably along the same ${place} for up to ${input.durationMinutes === 15 ? 5 : input.durationMinutes === 30 ? 10 : 20} minutes. Rest or skip this task whenever you need.`, verificationRequired: false }
        : fixture.tasks[1],
      fixture.tasks[2],
    ];
  } else if (input.mood === "notice") {
    tasks = [{ ...fixture.tasks[0], instruction: `From a ${place}, photograph a repeating pattern in shadows, paving, or leaves. Stay on the path; observe plants without touching them.` }, ...fixture.tasks.slice(1)];
  }
  return QuestSchema.parse({ ...fixture, ...input, intro: `${intro} Take up to ${input.durationMinutes} minutes, including pauses. No need to rush or travel far.`, id: `${fixture.id}-${input.durationMinutes}-${input.mood}-${input.environment}`, tasks });
}
