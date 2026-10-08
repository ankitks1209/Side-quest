import { describe, expect, it, vi } from "vitest";
import { DEFAULT_INPUT } from "../quests/fixtures";
import { GoogleGemmaModel } from "./google-gemma-model";

describe("GoogleGemmaModel", () => {
  it("sends the frozen stateless request contract", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => new Response(JSON.stringify({
      status: "completed",
      steps: [{ type: "model_output", content: [{ type: "text", text: "{}" }] }],
    }), { status: 200 }));
    const model = new GoogleGemmaModel({
      apiKey: "test-secret",
      baseUrl: "https://example.test/v1beta/",
      model: "gemma-4-26b-a4b-it",
      fetchImpl: fetchMock,
    });

    await expect(model.generateQuest(DEFAULT_INPUT)).resolves.toBe("{}");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.test/v1beta/interactions");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({
      "Content-Type": "application/json",
      "x-goog-api-key": "test-secret",
    });
    const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      model: "gemma-4-26b-a4b-it",
      store: false,
      generation_config: { thinking_level: "minimal" },
    });
    expect(body).not.toHaveProperty("previous_interaction_id");
    expect(body.input).toContain("durationMinutes: 15");
  });

  it("does not include the API key in the request body", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (_input, init) => {
      expect(String(init?.body)).not.toContain("test-secret");
      return new Response(JSON.stringify({
        status: "completed",
        steps: [{ type: "model_output", content: [{ type: "text", text: "{}" }] }],
      }));
    });
    await new GoogleGemmaModel({ apiKey: "test-secret", fetchImpl: fetchMock }).generateQuest(DEFAULT_INPUT);
  });

  it("rejects HTTP and response JSON failures without retrying", async () => {
    const httpFetch = vi.fn<typeof fetch>(async () => new Response("no", { status: 503 }));
    await expect(new GoogleGemmaModel({ apiKey: "key", fetchImpl: httpFetch }).generateQuest(DEFAULT_INPUT)).rejects.toThrow("http_failure");
    expect(httpFetch).toHaveBeenCalledTimes(1);

    const jsonFetch = vi.fn<typeof fetch>(async () => new Response("not-json"));
    await expect(new GoogleGemmaModel({ apiKey: "key", fetchImpl: jsonFetch }).generateQuest(DEFAULT_INPUT)).rejects.toThrow("response_json_failure");
    expect(jsonFetch).toHaveBeenCalledTimes(1);
  });
});
