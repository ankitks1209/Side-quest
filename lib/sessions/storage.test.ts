import { describe, expect, it } from "vitest";
import { mockQuests } from "../quests/fixtures";
import { startQuestSession } from "./timing";
import { ACTIVE_SESSION_KEY, clearActiveSession, loadActiveSession, saveActiveSession, SESSION_STORAGE_WARNING } from "./storage";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("active session storage", () => {
  it("round-trips one validated record and clears it", () => {
    const storage = new MemoryStorage();
    const record = startQuestSession(mockQuests[0], 1_000, true);
    expect(saveActiveSession(record, storage)).toBeNull();
    expect(loadActiveSession(storage)).toEqual({ value: record, warning: null });
    expect(clearActiveSession(storage)).toBeNull();
    expect(loadActiveSession(storage).value).toBeNull();
  });

  it.each(["not json", JSON.stringify({ version: 99 })])("discards corrupt or invalid state", (raw) => {
    const storage = new MemoryStorage();
    storage.setItem(ACTIVE_SESSION_KEY, raw);
    const loaded = loadActiveSession(storage);
    expect(loaded).toEqual({ value: null, warning: SESSION_STORAGE_WARNING });
  });

  it("contains no image data", () => {
    const storage = new MemoryStorage();
    saveActiveSession(startQuestSession(mockQuests[0], 1_000, true), storage);
    expect(storage.getItem(ACTIVE_SESSION_KEY)).not.toMatch(/imageBytes|objectURL|blob:/i);
  });

  it("turns get, set, quota and clear failures into controlled warnings", () => {
    const broken = new MemoryStorage();
    broken.getItem = () => { throw new Error("blocked"); };
    expect(loadActiveSession(broken).warning).toBe(SESSION_STORAGE_WARNING);

    const full = new MemoryStorage();
    full.setItem = () => { throw new Error("quota"); };
    expect(saveActiveSession(startQuestSession(mockQuests[0], 1_000, true), full)).toBe(SESSION_STORAGE_WARNING);

    const uncleared = new MemoryStorage();
    uncleared.removeItem = () => { throw new Error("blocked"); };
    expect(clearActiveSession(uncleared)).toBe(SESSION_STORAGE_WARNING);
  });
});
