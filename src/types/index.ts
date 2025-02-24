export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER'
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: OrganizationSize;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrganizationSize {
  SMALL = 'SMALL',     // < 50 employees
  MEDIUM = 'MEDIUM',   // 50-250 employees
  LARGE = 'LARGE',     // > 250 employees
}

export interface EmployeeRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  gender: string;
  ethnicity: string;
  position: string;
  department: string;
  startDate: Date;
  endDate?: Date;
  status: EmploymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum EmploymentStatus {
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE'
}

export interface ComplianceReport {
  id: string;
  organizationId: string;
  reportingPeriod: string;
  submissionDate: Date;
  status: ReportStatus;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
} 