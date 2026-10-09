import { ActiveSessionRecordSchema, type ActiveSessionRecord } from "./schema";

export const ACTIVE_SESSION_KEY = "sidequest:active-session:v1";
export const SESSION_STORAGE_WARNING = "Session recovery is unavailable on this browser, but your quest can continue.";

export type SessionStorageResult<T> = { value: T; warning: string | null };

export function loadActiveSession(storage: Storage = localStorage): SessionStorageResult<ActiveSessionRecord | null> {
  try {
    const raw = storage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return { value: null, warning: null };
    const parsed = ActiveSessionRecordSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      storage.removeItem(ACTIVE_SESSION_KEY);
      return { value: null, warning: SESSION_STORAGE_WARNING };
    }
    return { value: parsed.data, warning: null };
  } catch {
    return { value: null, warning: SESSION_STORAGE_WARNING };
  }
}

export function saveActiveSession(record: ActiveSessionRecord, storage: Storage = localStorage): string | null {
  try {
    storage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(ActiveSessionRecordSchema.parse(record)));
    return null;
  } catch {
    return SESSION_STORAGE_WARNING;
  }
}

export function clearActiveSession(storage: Storage = localStorage): string | null {
  try {
    storage.removeItem(ACTIVE_SESSION_KEY);
    return null;
  } catch {
    return SESSION_STORAGE_WARNING;
  }
}
