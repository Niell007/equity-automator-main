import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase environment variables. Please check your .env file.",
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for EE data
export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    position: string;
    employment_equity_data: {
        gender: string;
        race: string;
        disability_status: boolean;
        citizenship: string;
    };
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: string;
    name: string;
    manager_id: string;
    created_at: string;
}

export interface ComplianceReport {
    id: string;
    report_date: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    data: Record<string, any>;
    submitted_by: string;
    created_at: string;
    updated_at: string;
}

// Helper functions for data management
export const dataService = {
    employees: {
        async getAll() {
            const { data, error } = await supabase
                .from("employees")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },

        async create(
            employee: Omit<Employee, "id" | "created_at" | "updated_at">,
        ) {
            const { data, error } = await supabase
                .from("employees")
                .insert([employee])
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, updates: Partial<Employee>) {
            const { data, error } = await supabase
                .from("employees")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string) {
            const { error } = await supabase
                .from("employees")
                .delete()
                .eq("id", id);

            if (error) throw error;
        },
    },

    reports: {
        async getAll() {
            const { data, error } = await supabase
                .from("compliance_reports")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },

        async create(
            report: Omit<ComplianceReport, "id" | "created_at" | "updated_at">,
        ) {
            const { data, error } = await supabase
                .from("compliance_reports")
                .insert([report])
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, updates: Partial<ComplianceReport>) {
            const { data, error } = await supabase
                .from("compliance_reports")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
    },

    departments: {
        async getAll() {
            const { data, error } = await supabase
                .from("departments")
                .select("*")
                .order("name", { ascending: true });

            if (error) throw error;
            return data;
        },

        async create(department: Omit<Department, "id" | "created_at">) {
            const { data, error } = await supabase
                .from("departments")
                .insert([department])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
    },
};
