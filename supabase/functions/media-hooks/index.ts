import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface MediaPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  record: {
    id: string;
    filename: string;
    filepath: string;
    filesize: number;
    mimetype: string;
    uploaded_by: string;
    content_id?: string;
  };
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Audio
  "audio/mpeg",
  "audio/wav",
  // Video
  "video/mp4",
  "video/webm",
];

serve(async (req) => {
  const payload: MediaPayload = await req.json();

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    // Validate file size
    if (payload.record.filesize > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed size of ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`,
      );
    }

    // Validate mime type
    if (!ALLOWED_MIME_TYPES.includes(payload.record.mimetype)) {
      throw new Error(`File type ${payload.record.mimetype} is not allowed`);
    }

    switch (payload.type) {
      case "INSERT": {
        // Check user permissions
        const { data: userPerms, error: permError } = await supabaseAdmin
          .from("user_permissions")
          .select("permissions")
          .eq("user_id", payload.record.uploaded_by)
          .single();

        if (permError) throw permError;

        if (!userPerms?.permissions?.canUploadDocuments) {
          throw new Error("User does not have permission to upload files");
        }

        if (payload.record.filesize > userPerms.permissions.maxUploadSize) {
          throw new Error(
            `File size exceeds user's maximum allowed size of ${
              userPerms.permissions.maxUploadSize / 1024 / 1024
            }MB`,
          );
        }

        // Generate metadata
        const metadata: Record<string, string | number | null | object> = {
          dimensions: null,
          duration: null,
          pages: null,
          lastModified: new Date().toISOString(),
        };

        // Set type-specific metadata
        if (payload.record.mimetype.startsWith("image/")) {
          metadata.dimensions = { width: 0, height: 0 }; // Placeholder
        } else if (
          payload.record.mimetype.startsWith("video/") ||
          payload.record.mimetype.startsWith("audio/")
        ) {
          metadata.duration = 0; // Placeholder
        } else if (
          payload.record.mimetype === "application/pdf" ||
          payload.record.mimetype.includes("word")
        ) {
          metadata.pages = 0; // Placeholder
        }

        // Update media record with metadata
        const { error: updateError } = await supabaseAdmin
          .from("media")
          .update({
            metadata,
            status: "processed",
            processed_at: new Date().toISOString(),
          })
          .eq("id", payload.record.id);

        if (updateError) throw updateError;
        break;
      }

      case "DELETE": {
        // Check if file is referenced by any content
        if (payload.record.content_id) {
          const { data: content, error: contentError } = await supabaseAdmin
            .from("content")
            .select("status")
            .eq("id", payload.record.content_id)
            .single();

          if (contentError) throw contentError;

          if (content?.status === "published") {
            throw new Error(
              "Cannot delete file referenced by published content",
            );
          }
        }

        // Delete file from storage
        const { error: storageError } = await supabaseAdmin
          .storage
          .from("media")
          .remove([payload.record.filepath]);

        if (storageError) throw storageError;

        console.log(`File deleted: ${payload.record.filepath}`);
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("Media hook error:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error occurred";
    const errorDetails =
      error && typeof error === "object" && "details" in error
        ? (error as { details: unknown }).details
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
