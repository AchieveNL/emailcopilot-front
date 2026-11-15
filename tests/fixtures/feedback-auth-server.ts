// Isolated browser-server fixture only. Never imported by application code.
import { AsyncLocalStorage } from "node:async_hooks";

export const feedbackSession = new AsyncLocalStorage<string>();
export async function auth() { return { userId: feedbackSession.getStore() ?? null }; }
