import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const FUNCTIONS_DIR = path.join(process.cwd(), "supabase", "functions");
const PROJECT_REF = "wcypgfyvbotaordkoeeu";
const ACCESS_TOKEN = "sbp_958eba65981911d4e2a46bc5c7419ed3057de2fb";

async function main() {
    console.log("🚀 Preparing to deploy Edge Functions...");

    // Get list of function directories
    const functionDirs = fs.readdirSync(FUNCTIONS_DIR).filter((dir) =>
        fs.statSync(path.join(FUNCTIONS_DIR, dir)).isDirectory() &&
        dir !== "shared" // Exclude shared directory
    );

    console.log("📦 Found functions to deploy:", functionDirs);

    // Deploy each function
    for (const functionName of functionDirs) {
        try {
            console.log(`\n🔄 Deploying ${functionName}...`);

            // Deploy function using Supabase CLI with direct deployment
            execSync(
                `supabase functions deploy ${functionName} --project-ref ${PROJECT_REF} --no-verify-jwt --experimental`,
                {
                    stdio: "inherit",
                    env: {
                        ...process.env,
                        SUPABASE_ACCESS_TOKEN: ACCESS_TOKEN,
                    },
                },
            );

            console.log(`✅ ${functionName} deployed successfully`);
        } catch (error) {
            console.error(`❌ Failed to deploy ${functionName}:`, error);
            // Log more details about the error
            if (error instanceof Error) {
                console.error("Error details:", error.message);
            }
            continue;
        }
    }

    console.log("\n✨ Edge Functions deployment complete");
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
