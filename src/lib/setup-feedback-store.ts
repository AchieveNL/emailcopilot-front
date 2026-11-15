import { createHash, randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { SETUP_FEEDBACK_VERSION } from "./setup-feedback";
import { applyFeedbackCommand, createFeedbackRecord, feedbackState, type FeedbackCommand, type FeedbackRecord } from "./setup-feedback-state";

/** Temporary account storage shared by all browsers connected to this Node server. */
async function withRecord<T>(userId: string, operation: (record: FeedbackRecord, save: (record: FeedbackRecord) => Promise<void>) => Promise<T>): Promise<T> {
  const directory = path.join(process.cwd(), "feedback");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const identity = createHash("sha256").update(`${userId}:${SETUP_FEEDBACK_VERSION}`).digest("hex");
  const filename = path.join(directory, `${identity}.json`);
  const lockname = `${filename}.lock`;
  let lock;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { lock = await open(lockname, "wx", 0o600); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
  if (!lock) throw new Error("Feedback storage is busy");
  try {
    let record: FeedbackRecord;
    try {
      record = JSON.parse(await readFile(filename, "utf8")) as FeedbackRecord;
      if (record.owner !== userId || record.version !== SETUP_FEEDBACK_VERSION || !Number.isInteger(record.revision) || !record.events || !record.claimed) {
        throw new Error("Invalid feedback record");
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      record = createFeedbackRecord(userId, SETUP_FEEDBACK_VERSION);
    }
    return await operation(record, async (next) => {
      const temporary = `${filename}.${randomUUID()}.tmp`;
      try {
        await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
        await rename(temporary, filename);
      } finally { await unlink(temporary).catch(() => {}); }
    });
  } finally { await lock.close(); await unlink(lockname); }
}

export function loadFeedbackState(userId: string) {
  return withRecord(userId, async (record) => feedbackState(record, Date.now()));
}
export function updateFeedbackState(userId: string, command: FeedbackCommand) {
  return withRecord(userId, async (record, save) => {
    const result = applyFeedbackCommand(record, command, Date.now());
    if (result.record.revision !== record.revision) await save(result.record);
    return result.reply;
  });
}
