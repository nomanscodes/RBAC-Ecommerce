import { Optional } from "sequelize";

// Role attributes interface
export interface RoleAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
}

// Optional fields for creation
export interface RoleCreationAttributes extends Optional<
  RoleAttributes,
  "id"
> {}

// Permission attributes interface
export interface PermissionAttributes {
  id: number;
  name: string;
  slug: string;
  module: string;
  action: string;
  createdAt?: Date;
}

// Optional fields for creation
export interface PermissionCreationAttributes extends Optional<
  PermissionAttributes,
  "id"
> {}

// UserRole (junction table) attributes
export interface UserRoleAttributes {
  id: number;
  userId: number;
  roleId: number;
  createdAt?: Date;
}

// Optional fields for creation
export interface UserRoleCreationAttributes extends Optional<
  UserRoleAttributes,
  "id"
> {}

// RolePermission (junction table) attributes
export interface RolePermissionAttributes {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt?: Date;
}

// Optional fields for creation
export interface RolePermissionCreationAttributes extends Optional<
  RolePermissionAttributes,
  "id"
> {}
