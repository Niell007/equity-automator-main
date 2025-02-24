import { execSync } from "child_process";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
    try {
        console.log("🔗 Linking project with Supabase...\n");

        // Extract project reference from URL
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
            throw new Error("VITE_SUPABASE_URL is required");
        }

        const projectRef = supabaseUrl.split("//")[1].split(".")[0];
        console.log(`📌 Project reference: ${projectRef}`);

        // Link project
        console.log("\n🔄 Running link command...");
        execSync(`supabase link --project-ref ${projectRef}`, {
            stdio: "inherit",
        });

        console.log("\n✅ Project linked successfully!");
        console.log("\n🚀 You can now run:");
        console.log("npm run deploy:supabase");
    } catch (error) {
        console.error("\n❌ Project linking failed:", error);
        process.exit(1);
    }
}

main();
