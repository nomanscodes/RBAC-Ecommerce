// Import all models
import User from "./user";
import Role from "./role";
import Permission from "./permission";
import UserRole from "./userRole";
import RolePermission from "./rolePermission";

// Define associations
// User <-> Role (Many-to-Many through UserRole)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
  as: "roles",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
  as: "users",
});

// Role <-> Permission (Many-to-Many through RolePermission)
Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
  as: "permissions",
});

Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

// UserRole belongsTo User and Role
UserRole.belongsTo(User, { foreignKey: "userId", as: "user" });
UserRole.belongsTo(Role, { foreignKey: "roleId", as: "role" });

// RolePermission belongsTo Role and Permission
RolePermission.belongsTo(Role, { foreignKey: "roleId", as: "role" });
RolePermission.belongsTo(Permission, {
  foreignKey: "permissionId",
  as: "permission",
});

// Export all models
export { User, Role, Permission, UserRole, RolePermission };

export default {
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
};
