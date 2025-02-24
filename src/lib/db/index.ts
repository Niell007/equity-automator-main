import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

export const db = drizzle(sql, { schema });

// Utility function to handle database errors
export const handleDbError = (error: unknown) => {
  console.error('Database error:', error);
  throw new Error('An error occurred while accessing the database');
};

// Type-safe query builder functions
export const queries = {
  // Organization queries
  async getOrganization(id: number) {
    try {
      const [org] = await db.select().from(schema.organizations).where(sql`id = ${id}`).limit(1);
      return org;
    } catch (error) {
      handleDbError(error);
    }
  },

  // Employee queries
  async getEmployeesByOrganization(organizationId: number) {
    try {
      return await db
        .select()
        .from(schema.employees)
        .where(sql`organization_id = ${organizationId}`);
    } catch (error) {
      handleDbError(error);
    }
  },

  // Department queries
  async getDepartmentsByOrganization(organizationId: number) {
    try {
      return await db
        .select()
        .from(schema.departments)
        .where(sql`organization_id = ${organizationId}`);
    } catch (error) {
      handleDbError(error);
    }
  },

  // Compliance report queries
  async getComplianceReports(organizationId: number) {
    try {
      return await db
        .select()
        .from(schema.complianceReports)
        .where(sql`organization_id = ${organizationId}`)
        .orderBy(sql`created_at DESC`);
    } catch (error) {
      handleDbError(error);
    }
  },

  // User queries
  async getUserByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(schema.users)
        .where(sql`email = ${email}`)
        .limit(1);
      return user;
    } catch (error) {
      handleDbError(error);
    }
  },
};

// Type-safe mutation functions
export const mutations = {
  // Organization mutations
  async createOrganization(data: Omit<typeof schema.organizations.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const [org] = await db.insert(schema.organizations).values(data).returning();
      return org;
    } catch (error) {
      handleDbError(error);
    }
  },

  // Employee mutations
  async createEmployee(data: Omit<typeof schema.employees.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const [employee] = await db.insert(schema.employees).values(data).returning();
      return employee;
    } catch (error) {
      handleDbError(error);
    }
  },

  // Compliance report mutations
  async createComplianceReport(data: Omit<typeof schema.complianceReports.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const [report] = await db.insert(schema.complianceReports).values(data).returning();
      return report;
    } catch (error) {
      handleDbError(error);
    }
  },

  async updateComplianceReport(id: number, data: Partial<typeof schema.complianceReports.$inferInsert>) {
    try {
      const [report] = await db
        .update(schema.complianceReports)
        .set({ ...data, updatedAt: new Date() })
        .where(sql`id = ${id}`)
        .returning();
      return report;
    } catch (error) {
      handleDbError(error);
    }
  },
}; 