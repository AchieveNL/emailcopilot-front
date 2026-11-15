import axios from "axios";
import { SETUP_FEEDBACK_VERSION, type FeedbackReply, type FeedbackTransport } from "./setup-feedback";

// Same-origin Clerk cookies authenticate this temporary local-store API.
// Replace this adapter when the separate backend owns feedback persistence.
const http = axios.create({ withCredentials: true, timeout: 10000, headers: { "Content-Type": "application/json" } });
const endpoint = "/api/feedback";
export const setupFeedbackApi: FeedbackTransport = {
  load: () => http.get<FeedbackReply>(endpoint).then((response) => response.data.state),
  record: (event) => http.post<FeedbackReply>(endpoint, { version: SETUP_FEEDBACK_VERSION, operation: "success", event }).then((response) => response.data),
  claim: (offerId) => http.post<FeedbackReply>(endpoint, { version: SETUP_FEEDBACK_VERSION, operation: "claim", offerId }).then((response) => response.data),
  snooze: (offerId) => http.post<FeedbackReply>(endpoint, { version: SETUP_FEEDBACK_VERSION, operation: "snooze", offerId }).then((response) => response.data),
  submit: (payload, submissionId) => http.post<FeedbackReply>(endpoint, { ...payload, operation: "submit" }, {
    headers: { "Idempotency-Key": submissionId },
  }).then((response) => ({ status: response.status, state: response.data.state })),
};
