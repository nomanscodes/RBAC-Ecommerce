import { Model, Optional } from "sequelize";

// User role enum
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
  SUPERUSER = "superuser",
}

// User attributes interface
export interface UserAttributes {
  id: number;
  role: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

// Optional fields for creation
export interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id"
> {}

// User model interface extending Sequelize Model
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

// DTO for user response (without password)
export interface UserResponseDTO {
  id: number;
  role: string;
  name: string;
  email: string;
  createdAt?: Date;
}

// DTO for user creation request
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

// DTO for login request
export interface LoginDTO {
  email: string;
  password: string;
}

// JWT Payload interface
export interface JWTPayload {
  id: number;
  role: string;
  permissions?: Array<{
    module: string;
    actions: string[];
  }>;
  iat?: number;
  exp?: number;
}

// Query parameters for getUsers
export interface GetUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
}

// Pagination metadata
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  users: T[];
  pagination: PaginationMeta;
}
