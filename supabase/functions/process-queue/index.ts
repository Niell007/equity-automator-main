import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
    createClient,
    SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Database, ErrorCode, ErrorResponse } from "../shared/types.ts";

type SupabaseClientType = SupabaseClient<Database>;

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
};

const RETRY_DELAY_MS = 60000; // 1 minute
const MAX_BATCH_SIZE = 10;

async function processQueueItem(
    supabase: SupabaseClientType,
    queueItem: Database["app_private"]["Tables"]["notification_queue"]["Row"],
): Promise<boolean> {
    try {
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

        const response =
            `Processed ${notification.type}: ${notification.message}`;

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

        return true;
    } catch (error) {
        const { error: queueError } = await supabase
            .from("app_private.notification_queue")
            .update({
                attempts: queueItem.attempts + 1,
                next_attempt_at: new Date(Date.now() + RETRY_DELAY_MS)
                    .toISOString(),
                last_error: error instanceof Error
                    ? error.message
                    : String(error),
            })
            .eq("id", queueItem.id);

        if (queueError) {
            console.error("Failed to update queue item:", queueError);
        }

        return false;
    }
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
                auth: {
                    persistSession: false,
                },
            },
        ) as SupabaseClientType;

        const { data: queueItems, error: queueError } = await supabaseClient
            .from("app_private.notification_queue")
            .select()
            .lt("attempts", "max_attempts")
            .lte("next_attempt_at", new Date().toISOString())
            .order("next_attempt_at", { ascending: true })
            .limit(MAX_BATCH_SIZE);

        if (queueError) {
            throw {
                error: "Failed to fetch queue items",
                code: "QUEUE_FETCH_ERROR" as ErrorCode,
                details: { error: queueError },
            };
        }

        if (!queueItems?.length) {
            return new Response(
                JSON.stringify({ message: "No items to process" }),
                {
                    headers: {
                        ...CORS_HEADERS,
                        "Content-Type": "application/json",
                    },
                    status: 200,
                },
            );
        }

        const results = await Promise.all(
            queueItems.map((item) => processQueueItem(supabaseClient, item)),
        );

        const processed = results.filter(Boolean).length;
        const failed = results.length - processed;

        return new Response(
            JSON.stringify({
                message: `Processed ${processed} items, ${failed} failed`,
                processed,
                failed,
            }),
            {
                headers: {
                    ...CORS_HEADERS,
                    "Content-Type": "application/json",
                },
                status: 200,
            },
        );
    } catch (error) {
        console.error("Error processing queue:", error);

        const errorResponse: ErrorResponse = {
            error: error instanceof Error
                ? error.message
                : "Internal server error",
            code: "QUEUE_PROCESSING_ERROR",
        };

        return new Response(
            JSON.stringify(errorResponse),
            {
                headers: {
                    ...CORS_HEADERS,
                    "Content-Type": "application/json",
                },
                status: 500,
            },
        );
    }
});
