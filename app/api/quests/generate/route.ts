import { GoogleGemmaModel } from "@/lib/ai/google-gemma-model";
import { generateApprovedQuest } from "@/lib/quests/generation";
import { QuestInputSchema } from "@/lib/quests/schema";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Choose valid quest options and try again." }, { status: 400 });
  }

  const input = QuestInputSchema.safeParse(body);
  if (!input.success) {
    return Response.json({ message: "Choose valid quest options and try again." }, { status: 400 });
  }

  try {
    const result = await generateApprovedQuest(input.data, new GoogleGemmaModel());
    return Response.json(result);
  } catch {
    return Response.json(
      { message: "We couldn’t prepare a quest right now. Please try again." },
      { status: 503 },
    );
  }
}
