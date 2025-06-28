import { UserRole, ROLE_MAP } from '@/types/auth';

/**
 * Convert numeric role to string role
 */
export function mapRoleToString(role: UserRole): string {
  if (typeof role === 'number') {
    return ROLE_MAP[role as keyof typeof ROLE_MAP] || 'Customer';
  }
  return role;
}

/**
 * Check if user has SuperAdmin role (handles both string and numeric)
 */
export function isSuperAdmin(role: UserRole): boolean {
  const stringRole = mapRoleToString(role);
  return stringRole === 'SuperAdmin';
}

/**
 * Check if user has Barber role (handles both string and numeric)
 */
export function isBarber(role: UserRole): boolean {
  const stringRole = mapRoleToString(role);
  return stringRole === 'Barber';
}

/**
 * Check if user has Customer role (handles both string and numeric)
 */
export function isCustomer(role: UserRole): boolean {
  const stringRole = mapRoleToString(role);
  return stringRole === 'Customer';
}