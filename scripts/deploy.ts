import { execSync } from "child_process";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load environment variables
dotenv.config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
);

async function main() {
    try {
        console.log("🚀 Starting automated Supabase deployment...\n");

        // 1. Verify environment
        console.log("📋 Verifying environment...");
        const requiredEnvVars = [
            "VITE_SUPABASE_URL",
            "VITE_SUPABASE_ANON_KEY",
        ];

        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(
                    `Missing required environment variable: ${envVar}`,
                );
            }
        }
        console.log("✅ Environment verified\n");

        // 2. Deploy migrations first
        console.log("📦 Deploying migrations...");
        try {
            execSync("supabase db push", {
                stdio: "inherit",
            });
            console.log("✅ Migrations deployed successfully\n");
        } catch (error) {
            console.error("❌ Migration deployment failed:", error);
            throw error;
        }

        // 3. Deploy database schema
        console.log("📦 Deploying database schema...");
        const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
        const schemaContent = fs.readFileSync(schemaPath, "utf8");

        // Execute schema through direct SQL query
        const { error: schemaError } = await supabase
            .from("_sqlexec")
            .insert({ query: schemaContent })
            .select();

        if (schemaError) {
            console.error("❌ Schema deployment failed:", schemaError);
            throw schemaError;
        }
        console.log("✅ Schema deployed successfully\n");

        // 4. Deploy Edge Functions
        console.log("🔧 Deploying Edge Functions...");
        const functionsDir = path.join(process.cwd(), "supabase", "functions");
        const functions = fs.readdirSync(functionsDir);

        for (const func of functions) {
            if (fs.statSync(path.join(functionsDir, func)).isDirectory()) {
                console.log(`📤 Deploying function: ${func}`);
                try {
                    execSync(`supabase functions deploy ${func}`, {
                        stdio: "inherit",
                    });
                    console.log(`✅ Deployed ${func} successfully`);
                } catch (error) {
                    console.error(`❌ Failed to deploy ${func}:`, error);
                    throw error;
                }
            }
        }
        console.log("✅ All Edge Functions deployed\n");

        // 5. Run integration tests
        console.log("🧪 Running integration tests...");
        try {
            execSync("npx vitest run", {
                stdio: "inherit",
            });
            console.log("✅ All tests passed\n");
        } catch (error) {
            console.error("❌ Tests failed:", error);
            throw error;
        }

        // 6. Verify deployment
        console.log("🔍 Verifying deployment...");

        // Check database connection
        const { data: roles, error: rolesError } = await supabase
            .from("roles")
            .select("*")
            .limit(1);

        if (rolesError) {
            throw new Error(
                `Database verification failed: ${rolesError.message}`,
            );
        }

        // Check Edge Functions
        const healthCheck = await fetch(
            `${process.env.VITE_SUPABASE_URL}/functions/v1/health-check`,
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
                },
            },
        );

        if (!healthCheck.ok) {
            throw new Error("Edge Functions verification failed");
        }

        console.log("✅ Deployment verified\n");
        console.log("🎉 Deployment completed successfully!");
    } catch (error) {
        console.error("\n❌ Deployment failed:", error);
        process.exit(1);
    }
}

main();
