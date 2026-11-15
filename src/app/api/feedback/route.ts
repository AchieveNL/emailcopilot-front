import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { SETUP_FEEDBACK_VERSION } from "@/lib/setup-feedback";
import type { FeedbackCommand } from "@/lib/setup-feedback-state";
import { loadFeedbackState, updateFeedbackState } from "@/lib/setup-feedback-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
const json = (value: unknown, status = 200) => NextResponse.json(value, { status, headers });
const isId = (value: unknown): value is string => typeof value === "string" && value.length > 0 && value.length <= 256;

function parseCommand(body: unknown): FeedbackCommand | null {
  if (!body || typeof body !== "object" || !("version" in body) || body.version !== SETUP_FEEDBACK_VERSION || !("operation" in body)) return null;
  if (body.operation === "success" && "event" in body && body.event && typeof body.event === "object") {
    const event = body.event;
    if (!("kind" in event) || (event.kind !== "test-email" && event.kind !== "launch") ||
      !("eventId" in event) || !isId(event.eventId) || event.eventId.length > 200 || !("campaignId" in event) || !isId(event.campaignId)) return null;
    return { operation: "success", event: { kind: event.kind, eventId: event.eventId, campaignId: event.campaignId } };
  }
  if ((body.operation === "claim" || body.operation === "snooze") && "offerId" in body && isId(body.offerId)) {
    return { operation: body.operation, offerId: body.offerId };
  }
  if (body.operation === "submit" && "rating" in body && typeof body.rating === "number" &&
    Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5) {
    if ("comment" in body && (typeof body.comment !== "string" || body.comment.length > 2000)) return null;
    const comment = "comment" in body && typeof body.comment === "string" ? body.comment.trim() : "";
    return { operation: "submit", rating: body.rating, ...(comment ? { comment } : {}) };
  }
  return null;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return json({ error: "Sign in to access feedback." }, 401);
  try { return json({ state: await loadFeedbackState(userId) }); }
  catch { return json({ error: "Feedback storage is unavailable." }, 503); }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return json({ error: "Sign in to access feedback." }, 401);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "JSON is required." }, 415);
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0].trim() ?? request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() ?? request.nextUrl.protocol.replace(":", "");
  const publicOrigin = forwardedHost ? `${forwardedProtocol}://${forwardedHost}` : request.nextUrl.origin;
  if (origin && origin !== request.nextUrl.origin && origin !== publicOrigin) return json({ error: "Invalid request origin." }, 403);
  let command: FeedbackCommand | null;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 8192) return json({ error: "Feedback is too long." }, 413);
    command = parseCommand(JSON.parse(raw));
  } catch { return json({ error: "Invalid feedback request." }, 400); }
  if (!command) return json({ error: "Invalid feedback request." }, 400);
  try { return json(await updateFeedbackState(userId, command)); }
  catch { return json({ error: "Feedback could not be saved. Please try again." }, 503); }
}
