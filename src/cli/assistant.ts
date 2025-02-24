import { Command } from "commander";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import debug from "debug";

// Initialize debuggers with namespaces for better filtering
const logInfo = debug("assistant:info");
const logError = debug("assistant:error");
const logDebug = debug("assistant:debug");
const logTelemetry = debug("assistant:telemetry");

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredEnvVars = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
];

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        logError(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const program = new Command();

// Initialize Supabase client
const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
        auth: {
            persistSession: false,
        },
    },
);

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Helper function to prompt for input
const prompt = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

// Add telemetry tracking
const trackEvent = (eventName: string, properties: Record<string, any>) => {
    logTelemetry(`${eventName}:`, properties);
    // Here we could add actual telemetry service integration
};

// Add structured error handling
class AssistantError extends Error {
    constructor(
        message: string,
        public code: string,
        public metadata?: Record<string, any>,
    ) {
        super(message);
        this.name = "AssistantError";
    }
}

// Helper function to handle errors consistently
const handleError = (error: unknown, context: string) => {
    if (error instanceof AssistantError) {
        logError(
            `${context} - ${error.code}: ${error.message}`,
            error.metadata,
        );
    } else {
        logError(`${context} - UNKNOWN: ${error}`);
    }
    trackEvent("error", { context, error: String(error) });
};

// Update sendNotification with better error handling
async function sendNotification(type: string, message: string, userId: string) {
    trackEvent("notification_attempt", { type, userId });
    try {
        const response = await fetch(
            `${process.env.VITE_SUPABASE_URL}/functions/v1/notify`,
            {
                method: "POST",
                headers: {
                    "Authorization":
                        `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ type, message, userId }),
            },
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new AssistantError(
                `Failed to send notification: ${errorText}`,
                "NOTIFICATION_FAILED",
                { statusCode: response.status, type, userId },
            );
        }

        const result = await response.json();
        trackEvent("notification_success", { type, userId });
        logDebug("Notification sent:", result);
        return result;
    } catch (error) {
        handleError(error, "sendNotification");
        throw error;
    }
}

// Helper function to validate user exists
async function validateUser(userId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from("auth.users")
            .select("id")
            .eq("id", userId)
            .single();

        if (error) {
            logError("Error validating user:", error);
            return false;
        }

        return !!data;
    } catch (error) {
        logError("Error validating user:", error);
        return false;
    }
}

// Initialize the CLI
program
    .name("assistant")
    .description("CLI tool for interacting with the AI assistant")
    .version("1.0.0");

// Add command to start interactive session
program
    .command("chat")
    .description("Start an interactive chat session with the AI assistant")
    .option("-u, --user <id>", "User ID for the session")
    .option("-d, --debug", "Enable debug mode")
    .action(async (options) => {
        if (options.debug) {
            debug.enable("assistant:*");
        }

        if (!options.user) {
            logError("Error: User ID is required. Use --user or -u option.");
            process.exit(1);
        }

        // Validate user exists
        const isValidUser = await validateUser(options.user);
        if (!isValidUser) {
            logError("Error: Invalid user ID");
            process.exit(1);
        }

        logInfo("Starting chat session with AI assistant...\n");

        try {
            while (true) {
                const input = await prompt("You: ");

                if (
                    input.toLowerCase() === "exit" ||
                    input.toLowerCase() === "quit"
                ) {
                    logInfo("\nEnding chat session...");
                    break;
                }

                logDebug("Processing input:", input);

                // Send the message as a notification
                const result = await sendNotification(
                    "chat",
                    input,
                    options.user,
                );

                console.log("Assistant:", result.message);
            }
        } catch (error) {
            logError("Error in chat session:", error);
        } finally {
            rl.close();
        }
    });

// Add command to execute a single instruction
program
    .command("execute")
    .description("Execute a single instruction")
    .argument("<instruction>", "The instruction to execute")
    .option("-u, --user <id>", "User ID for the instruction")
    .option("-d, --debug", "Enable debug mode")
    .action(async (instruction, options) => {
        if (options.debug) {
            debug.enable("assistant:*");
        }

        if (!options.user) {
            logError("Error: User ID is required. Use --user or -u option.");
            process.exit(1);
        }

        // Validate user exists
        const isValidUser = await validateUser(options.user);
        if (!isValidUser) {
            logError("Error: Invalid user ID");
            process.exit(1);
        }

        try {
            logDebug("Executing instruction:", instruction);

            const result = await sendNotification(
                "instruction",
                instruction,
                options.user,
            );

            console.log("Assistant:", result.message);
        } catch (error) {
            logError("Error executing instruction:", error);
        } finally {
            rl.close();
        }
    });

// Parse command line arguments
program.parse();
