export interface Database {
    public: {
        Tables: Record<string, never>;
    };
    app_private: {
        Tables: {
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    type: NotificationType;
                    message: string;
                    response: string | null;
                    status: NotificationStatus;
                    metadata: Record<string, unknown>;
                    error_details: string | null;
                    created_at: string;
                    updated_at: string;
                    processed_at: string | null;
                };
                Insert: Omit<
                    Database["app_private"]["Tables"]["notifications"]["Row"],
                    "id" | "created_at" | "updated_at" | "processed_at"
                >;
            };
            notification_queue: {
                Row: {
                    id: string;
                    notification_id: string;
                    attempts: number;
                    max_attempts: number;
                    next_attempt_at: string;
                    last_error: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<
                    Database["app_private"]["Tables"]["notification_queue"][
                        "Row"
                    ],
                    "id" | "created_at" | "updated_at"
                >;
            };
        };
    };
    auth: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    [key: string]: unknown;
                };
            };
        };
    };
}

export type NotificationType = "chat" | "instruction";
export type NotificationStatus =
    | "pending"
    | "processing"
    | "completed"
    | "failed";

export interface NotificationPayload {
    type: NotificationType;
    message: string;
    userId: string;
    metadata?: Record<string, unknown>;
}

export interface ErrorResponse {
    error: string;
    code: ErrorCode;
    details?: Record<string, unknown>;
}

export type ErrorCode =
    | "INVALID_PAYLOAD"
    | "INVALID_USER"
    | "DB_ERROR"
    | "NOTIFICATION_NOT_FOUND"
    | "UPDATE_FAILED"
    | "QUEUE_FETCH_ERROR"
    | "QUEUE_PROCESSING_ERROR"
    | "UNKNOWN_ERROR";

export interface CustomError {
    error: string;
    code: ErrorCode;
    details?: Record<string, unknown>;
}
