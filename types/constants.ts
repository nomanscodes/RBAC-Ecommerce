// API Response status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

// Sorting order
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

// Environment types
export enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PAGE_MIN: 1,
  LIMIT_MIN: 1,
  LIMIT_MAX: 100,
  LIMIT_DEFAULT: 10,
} as const;

// JWT constants
export const JWT = {
  EXPIRES_IN: "24h",
  ALGORITHM: "HS256",
} as const;

// Regex patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
} as const;

// Permission actions
export const ACTIONS = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
} as const;

// Resource modules
export const MODULES = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  CATEGORIES: "categories",
  SETTINGS: "settings",
  REPORTS: "reports",
} as const;

// Full permission slugs for convenience
export const PERMISSIONS = {
  // User permissions
  USERS_CREATE: "users-create",
  USERS_READ: "users-read",
  USERS_UPDATE: "users-update",
  USERS_DELETE: "users-delete",

  // Product permissions
  PRODUCTS_CREATE: "products-create",
  PRODUCTS_READ: "products-read",
  PRODUCTS_UPDATE: "products-update",
  PRODUCTS_DELETE: "products-delete",

  // Order permissions
  ORDERS_CREATE: "orders-create",
  ORDERS_READ: "orders-read",
  ORDERS_UPDATE: "orders-update",
  ORDERS_DELETE: "orders-delete",

  // Category permissions
  CATEGORIES_CREATE: "categories-create",
  CATEGORIES_READ: "categories-read",
  CATEGORIES_UPDATE: "categories-update",
  CATEGORIES_DELETE: "categories-delete",

  // Settings permissions
  SETTINGS_READ: "settings-read",
  SETTINGS_UPDATE: "settings-update",

  // Reports permissions
  REPORTS_READ: "reports-read",
} as const;

// Type helpers
export type PermissionAction = (typeof ACTIONS)[keyof typeof ACTIONS];
export type PermissionModule = (typeof MODULES)[keyof typeof MODULES];
export type PermissionSlug = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
