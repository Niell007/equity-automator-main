import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface ContentPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: string;
    title: string;
    slug: string;
    status: string;
    author_id: string;
    content: string;
    type: string;
  };
  old_record?: {
    id: string;
    status: string;
    slug: string;
    title: string;
  };
}

const VALID_STATUSES = ["draft", "published", "archived"];
const VALID_TYPES = ["post", "page", "document", "template"];

serve(async (req) => {
  const payload: ContentPayload = await req.json();

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    // Validate content status
    if (!VALID_STATUSES.includes(payload.record.status)) {
      throw new Error(`Invalid status: ${payload.record.status}`);
    }

    // Validate content type
    if (!VALID_TYPES.includes(payload.record.type)) {
      throw new Error(`Invalid type: ${payload.record.type}`);
    }

    switch (payload.type) {
      case "INSERT":
      case "UPDATE": {
        const updates: Record<string, string | null> = {};

        // Generate slug if not provided or changed
        if (
          !payload.record.slug ||
          (payload.old_record &&
            payload.record.title !== payload.old_record.title)
        ) {
          const baseSlug = payload.record.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

          // Check for slug uniqueness
          let slug = baseSlug;
          let counter = 1;
          while (true) {
            const { data, error } = await supabaseAdmin
              .from("content")
              .select("id")
              .eq("slug", slug)
              .neq("id", payload.record.id)
              .single();

            if (error || !data) break;
            slug = `${baseSlug}-${counter++}`;
          }

          updates.slug = slug;
        }

        // Update published_at when status changes to published
        if (
          payload.record.status === "published" &&
          (!payload.old_record || payload.old_record.status !== "published")
        ) {
          updates.published_at = new Date().toISOString();
        }

        // Only update if we have changes
        if (Object.keys(updates).length > 0) {
          const { error: updateError } = await supabaseAdmin
            .from("content")
            .update(updates)
            .eq("id", payload.record.id);

          if (updateError) throw updateError;
        }

        break;
      }

      case "DELETE": {
        // Check for any dependent content
        const { data: dependencies, error: depError } = await supabaseAdmin
          .from("content")
          .select("id")
          .eq("parent_id", payload.record.id);

        if (depError) throw depError;

        if (dependencies && dependencies.length > 0) {
          throw new Error("Cannot delete content with dependencies");
        }

        // Archive associated media
        const { error: mediaError } = await supabaseAdmin
          .from("media")
          .update({
            content_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("content_id", payload.record.id);

        if (mediaError) throw mediaError;
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Content hook error:", error);
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
