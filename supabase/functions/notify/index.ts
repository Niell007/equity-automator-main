import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.7.1";
import {
  CustomError,
  Database,
  ErrorCode,
  ErrorResponse,
  NotificationPayload,
} from "../shared/types.ts";

type SupabaseClientType = SupabaseClient<Database>;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function isCustomError(error: unknown): error is CustomError {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    "code" in error
  );
}

function isValidPayload(payload: unknown): payload is NotificationPayload {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;
  return (
    (p.type === "chat" || p.type === "instruction") &&
    typeof p.message === "string" &&
    typeof p.userId === "string"
  );
}

async function processQueueItem(
  supabase: SupabaseClientType,
  queueItem: Database["app_private"]["Tables"]["notification_queue"]["Row"],
): Promise<void> {
  const { data: notification, error: notifError } = await supabase
    .from("app_private.notifications")
    .select()
    .eq("id", queueItem.notification_id)
    .single();

  if (notifError || !notification) {
    throw {
      error: "Notification not found",
      code: "NOTIFICATION_NOT_FOUND" as ErrorCode,
      details: { notification_id: queueItem.notification_id },
    };
  }

  const response = `Processed ${notification.type}: ${notification.message}`;

  const { error: updateError } = await supabase
    .from("app_private.notifications")
    .update({
      response,
      status: "completed",
      processed_at: new Date().toISOString(),
    })
    .eq("id", notification.id);

  if (updateError) {
    throw {
      error: "Failed to update notification",
      code: "UPDATE_FAILED" as ErrorCode,
      details: { error: updateError },
    };
  }

  await supabase
    .from("app_private.notification_queue")
    .delete()
    .eq("id", queueItem.id);
}

async function handleNotification(
  supabase: SupabaseClientType,
  payload: NotificationPayload,
): Promise<Database["app_private"]["Tables"]["notifications"]["Row"]> {
  const { data: user, error: userError } = await supabase
    .from("auth.users")
    .select("id")
    .eq("id", payload.userId)
    .single();

  if (userError || !user) {
    throw {
      error: "Invalid user ID",
      code: "INVALID_USER" as ErrorCode,
      details: { userId: payload.userId },
    };
  }

  const { data, error } = await supabase
    .from("app_private.notifications")
    .insert({
      user_id: payload.userId,
      type: payload.type,
      message: payload.message,
      metadata: payload.metadata ?? {},
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting notification:", error);
    throw {
      error: "Failed to create notification",
      code: "DB_ERROR" as ErrorCode,
      details: { error },
    };
  }

  try {
    const { data: queueItem } = await supabase
      .from("app_private.notification_queue")
      .select()
      .eq("notification_id", data.id)
      .single();

    if (queueItem) {
      await processQueueItem(supabase, queueItem);
    }
  } catch (error) {
    console.error("Error processing queue item:", error);
  }

  return data;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: { persistSession: false },
      },
    ) as SupabaseClientType;

    const payload = await req.json();

    if (!isValidPayload(payload)) {
      throw {
        error: "Invalid payload",
        code: "INVALID_PAYLOAD" as ErrorCode,
        details: { payload },
      };
    }

    console.log(
      `Processing ${payload.type} notification for user ${payload.userId}`,
    );

    const result = await handleNotification(supabaseClient, payload);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err: unknown) {
    console.error("Error processing notification:", err);

    const errorResponse: ErrorResponse = isCustomError(err)
      ? {
        error: err.error,
        code: err.code,
        details: err.details,
      }
      : {
        error: err instanceof Error ? err.message : "Internal server error",
        code: "UNKNOWN_ERROR",
      };

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        status: errorResponse.code === "INVALID_PAYLOAD" ? 400 : 500,
      },
    );
  }
});
