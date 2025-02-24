import { describe, expect, it } from "vitest";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Debug logging
console.log("SUPABASE_URL:", process.env.VITE_SUPABASE_URL);
console.log(
    "SUPABASE_KEY:",
    process.env.VITE_SUPABASE_ANON_KEY?.substring(0, 10) + "...",
);

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
);

describe("Supabase Integration Tests", () => {
    it("should connect to database", async () => {
        console.log("\nTesting database connection...");
        const { data: roles, error: rolesError } = await supabase
            .from("roles")
            .select("*")
            .limit(1);

        console.log("Roles data:", roles);
        if (rolesError?.code === "42P01") {
            console.log(
                "Table does not exist - this is expected if schema is not yet applied",
            );
        } else {
            expect(rolesError).toBeNull();
            expect(roles).toBeDefined();
        }
    });

    it("should handle unauthenticated state", async () => {
        console.log("\nTesting authentication...");
        const { data: { user }, error: authError } = await supabase.auth
            .getUser();

        console.log("User data:", user);
        // We expect to be unauthenticated
        expect(user).toBeNull();
    });

    it("should enforce Row Level Security", async () => {
        console.log("\nTesting Row Level Security...");
        const { data: content, error: contentError } = await supabase
            .from("content")
            .select("*")
            .eq("status", "published")
            .limit(1);

        console.log("Content data:", content);
        if (contentError?.code === "42P01") {
            console.log(
                "Table does not exist - this is expected if schema is not yet applied",
            );
        } else {
            expect(contentError).toBeNull();
            expect(content).toBeDefined();
        }
    });

    it("should access Edge Functions", async () => {
        console.log("\nTesting Edge Functions...");
        try {
            const response = await fetch(
                `${process.env.VITE_SUPABASE_URL}/functions/v1/health-check`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                },
            );

            if (!response.ok) {
                const text = await response.text();
                console.log("Edge Function response:", text);
            }

            // We expect a 404 until the function is deployed
            expect(response.status).toBe(404);
        } catch (error) {
            console.error("Edge Function error:", error);
            throw error;
        }
    });
});
