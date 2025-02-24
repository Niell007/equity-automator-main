import { sql } from '@vercel/postgres';
import { z } from 'zod';
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'USER']);
export const organizationSizeEnum = pgEnum('organization_size', ['SMALL', 'MEDIUM', 'LARGE']);
export const employmentStatusEnum = pgEnum('employment_status', ['ACTIVE', 'TERMINATED', 'ON_LEAVE']);
export const reportStatusEnum = pgEnum('report_status', ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']);
export const auditActionEnum = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'VIEW',
  'EXPORT',
  'SUBMIT',
  'APPROVE',
  'REJECT'
]);

// Organizations
export const organizations = pgTable('organizations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 100 }).notNull(),
  size: organizationSizeEnum('size').notNull(),
  registrationNumber: varchar('registration_number', { length: 50 }).unique(),
  taxId: varchar('tax_id', { length: 50 }).unique(),
  address: text('address'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  hashedPassword: varchar('hashed_password', { length: 255 }).notNull(),
  role: userRoleEnum('role').notNull().default('USER'),
  organizationId: integer('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Departments
export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 20 }).notNull(),
  description: text('description'),
  managerId: integer('manager_id').references(() => employees.id),
  parentDepartmentId: integer('parent_department_id').references(() => departments.id),
  status: varchar('status', { length: 20 }).notNull().default('ACTIVE'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Employees
export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  departmentId: integer('department_id').references(() => departments.id),
  employeeId: varchar('employee_id', { length: 50 }).notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  gender: varchar('gender', { length: 50 }).notNull(),
  ethnicity: varchar('ethnicity', { length: 100 }).notNull(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  position: varchar('position', { length: 100 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  status: employmentStatusEnum('status').notNull().default('ACTIVE'),
  salary: integer('salary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Compliance Reports
export const complianceReports = pgTable('compliance_reports', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  reportingPeriod: varchar('reporting_period', { length: 50 }).notNull(),
  submissionDate: timestamp('submission_date'),
  status: reportStatusEnum('status').notNull().default('DRAFT'),
  data: text('data').notNull(), // JSON data
  submittedBy: integer('submitted_by').references(() => users.id),
  approvedBy: integer('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  action: auditActionEnum('action').notNull(),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // e.g., 'employee', 'report'
  entityId: varchar('entity_id', { length: 50 }).notNull(),
  details: text('details').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Document Storage
export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // e.g., 'policy', 'report', 'evidence'
  name: varchar('name', { length: 255 }).notNull(),
  path: text('path').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: integer('size').notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Compliance Settings
export const complianceSettings = pgTable('compliance_settings', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').references(() => organizations.id).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Reports
export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['QUARTERLY', 'ANNUAL', 'AUDIT'] }).notNull(),
  status: text('status', { enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] }).notNull().default('PENDING'),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
  generatedBy: integer('generated_by').notNull().references(() => employees.id),
  score: integer('score'),
  findings: integer('findings').default(0),
  recommendations: integer('recommendations').default(0),
  periodStart: timestamp('period_start').notNull(),
  periodEnd: timestamp('period_end').notNull(),
  data: jsonb('data'),
  filePath: text('file_path'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const reportFindings = pgTable('report_findings', {
  id: serial('id').primaryKey(),
  reportId: integer('report_id').notNull().references(() => reports.id, { onDelete: 'cascade' }),
  type: text('type', { enum: ['ISSUE', 'RECOMMENDATION', 'OBSERVATION'] }).notNull(),
  category: text('category', { enum: ['GENDER_EQUITY', 'ETHNIC_DIVERSITY', 'PAY_EQUITY', 'PROMOTION_EQUITY', 'HIRING_PRACTICES'] }).notNull(),
  severity: text('severity', { enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  impact: text('impact'),
  recommendation: text('recommendation'),
  status: text('status', { enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'WONT_FIX'] }).notNull().default('OPEN'),
  dueDate: timestamp('due_date'),
  assignedTo: integer('assigned_to').references(() => employees.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  organizationId: integer('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull(),
  type: text('type', { enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'] }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  link: text('link'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  departments: many(departments),
  employees: many(employees),
  complianceReports: many(complianceReports),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [departments.organizationId],
    references: [organizations.id],
  }),
  manager: one(employees, {
    fields: [departments.managerId],
    references: [employees.id],
  }),
  parentDepartment: one(departments, {
    fields: [departments.parentDepartmentId],
    references: [departments.id],
  }),
  employees: many(employees),
  childDepartments: many(departments, {
    relationName: 'parentChild',
  }),
}));

export const employeesRelations = relations(employees, ({ one }) => ({
  organization: one(organizations, {
    fields: [employees.organizationId],
    references: [organizations.id],
  }),
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert; 