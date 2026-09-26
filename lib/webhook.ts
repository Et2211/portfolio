// Validation for the Sanity webhook body (app/api/revalidate).

/** The field of the Sanity webhook payload that decides what to expire. */
export interface WebhookPayload {
  _type?: string;
}

export const isWebhookPayload = (value: unknown): value is WebhookPayload =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  (!("_type" in value) || typeof value._type === "string");
