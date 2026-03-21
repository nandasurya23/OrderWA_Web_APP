type AuditLevel = "info" | "warn";

type AuditEvent = {
  action: string;
  level?: AuditLevel;
  metadata?: Record<string, unknown>;
  requestId: string;
  sellerId?: string;
};

function sanitizeMetadata(metadata?: Record<string, unknown>) {
  if (!metadata) {
    return undefined;
  }

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (key.toLowerCase().includes("password")) {
      sanitized[key] = "[REDACTED]";
      continue;
    }

    if (key.toLowerCase().includes("token")) {
      sanitized[key] = "[REDACTED]";
      continue;
    }

    sanitized[key] = value;
  }

  return sanitized;
}

export function logAuditEvent(event: AuditEvent) {
  const payload = {
    action: event.action,
    level: event.level ?? "info",
    metadata: sanitizeMetadata(event.metadata),
    requestId: event.requestId,
    sellerId: event.sellerId,
    ts: new Date().toISOString(),
  };

  if (event.level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.info(JSON.stringify(payload));
}
