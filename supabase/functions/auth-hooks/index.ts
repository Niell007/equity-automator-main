import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: string;
    email: string;
    raw_user_meta_data: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  old_record?: {
    id: string;
    email: string;
  };
}

serve(async (req) => {
  const payload: WebhookPayload = await req.json();

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    switch (payload.type) {
      case "INSERT": {
        // Get default role
        const { data: roleData, error: roleError } = await supabaseAdmin
          .from("roles")
          .select("id")
          .eq("name", "user")
          .single();

        if (roleError || !roleData?.id) {
          throw new Error("Default role not found");
        }

        // Set default role and metadata for new users
        const { error: updateError } = await supabaseAdmin
          .from("auth.users")
          .update({
            role_id: roleData.id,
            full_name: payload.record.raw_user_meta_data.full_name || "",
            avatar_url: payload.record.raw_user_meta_data.avatar_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", payload.record.id);

        if (updateError) throw updateError;

        // Create default permissions
        const { error: permError } = await supabaseAdmin
          .from("user_permissions")
          .insert({
            user_id: payload.record.id,
            permissions: {
              canUploadDocuments: true,
              canDeleteDocuments: false,
              maxUploadSize: 5242880, // 5MB
            },
          });

        if (permError) throw permError;
        break;
      }

      case "UPDATE": {
        const { error: updateError } = await supabaseAdmin
          .from("auth.users")
          .update({
            full_name: payload.record.raw_user_meta_data.full_name || "",
            avatar_url: payload.record.raw_user_meta_data.avatar_url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", payload.record.id);

        if (updateError) throw updateError;
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Auth hook error:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error occurred";
    const errorDetails =
      error && typeof error === "object" && "details" in error
        ? error.details
        : null;

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorDetails,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      },
    );
  }
});
