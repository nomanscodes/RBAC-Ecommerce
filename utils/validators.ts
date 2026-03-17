import { PATTERNS, VALIDATION } from "../types/constants";
import { UserRole } from "../types/user";

/**
 * Validation result type
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "Email is required" };
  }

  if (email.length > VALIDATION.EMAIL_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`,
    };
  }

  if (!PATTERNS.EMAIL.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  return { isValid: true };
};

/**
 * Validates password
 */
export const validatePassword = (password: string): ValidationResult => {
  if (!password || typeof password !== "string") {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`,
    };
  }

  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validates name
 */
export const validateName = (name: string): ValidationResult => {
  if (!name || typeof name !== "string") {
    return { isValid: false, error: "Name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < VALIDATION.NAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters long`,
    };
  }

  if (trimmedName.length > VALIDATION.NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validates pagination parameters
 */
export const validatePagination = (
  page: number,
  limit: number,
): ValidationResult => {
  if (page < VALIDATION.PAGE_MIN) {
    return {
      isValid: false,
      error: `Page must be at least ${VALIDATION.PAGE_MIN}`,
    };
  }

  if (limit < VALIDATION.LIMIT_MIN || limit > VALIDATION.LIMIT_MAX) {
    return {
      isValid: false,
      error: `Limit must be between ${VALIDATION.LIMIT_MIN} and ${VALIDATION.LIMIT_MAX}`,
    };
  }

  return { isValid: true };
};

/**
 * Type guard to check if value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

/**
 * Type guard to check if value is a number
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === "number" && !isNaN(value);
};

/**
 * Safely parse integer from string
 */
export const parseIntSafe = (
  value: string | undefined,
  defaultValue: number,
): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};
/**
 * Validates user role
 */
export const validateRole = (role: string): ValidationResult => {
  if (!role || typeof role !== "string") {
    return { isValid: false, error: "Role is required" };
  }

  const validRoles = Object.values(UserRole);
  if (!validRoles.includes(role as UserRole)) {
    return {
      isValid: false,
      error: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
    };
  }

  return { isValid: true };
};
