import Role from "../models/role";
import Permission from "../models/permission";
import RolePermission from "../models/rolePermission";

// Define permission types for response
export interface PermissionDetail {
  id: number;
  name: string;
  slug: string;
  module: string;
  action: string;
}

export interface GroupedPermission {
  module: string;
  actions: string[];
}

export interface RolePermissions {
  role: string;
  permissions: GroupedPermission[];
}

/**
 * Get roles and permissions for a user from database
 * @param userRoleName - The role name/slug of the user (e.g., 'admin', 'seller')
 * @returns RolePermissions object containing role and permissions grouped by module
 */
export const getRolesAndPermissions = async (
  userRoleName: string,
): Promise<RolePermissions> => {
  try {
    // Find the role by name or slug
    const role = await Role.findOne({
      where: {
        slug: userRoleName.toLowerCase(),
      },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] }, // Exclude junction table data
        },
      ],
    });

    // If role not found or no permissions, return empty
    if (!role) {
      console.warn(`Role not found: ${userRoleName}`);
      return {
        role: userRoleName,
        permissions: [],
      };
    }

    // Get permissions from the role
    const permissions = (role as any).permissions || [];

    // Group permissions by module (resource)
    const groupedPermissions: Record<string, string[]> = {};

    permissions.forEach((perm: any) => {
      const module = perm.module;
      const action = perm.action;

      if (!groupedPermissions[module]) {
        groupedPermissions[module] = [];
      }

      if (!groupedPermissions[module].includes(action)) {
        groupedPermissions[module].push(action);
      }
    });

    // Convert to array format
    const permissionsArray: GroupedPermission[] = Object.entries(
      groupedPermissions,
    ).map(([module, actions]) => ({
      module,
      actions,
    }));

    return {
      role: role.slug,
      permissions: permissionsArray,
    };
  } catch (error) {
    console.error("Error fetching roles and permissions:", error);
    return {
      role: userRoleName,
      permissions: [],
    };
  }
};

/**
 * Get detailed permissions for a user (not grouped)
 * @param userRoleName - The role name/slug of the user
 * @returns Array of detailed permission objects
 */
export const getDetailedPermissions = async (
  userRoleName: string,
): Promise<PermissionDetail[]> => {
  try {
    const role = await Role.findOne({
      where: {
        slug: userRoleName.toLowerCase(),
      },
      include: [
        {
          model: Permission,
          as: "permissions",
          through: { attributes: [] },
        },
      ],
    });

    if (!role) {
      return [];
    }

    const permissions = (role as any).permissions || [];

    return permissions.map((perm: any) => ({
      id: perm.id,
      name: perm.name,
      slug: perm.slug,
      module: perm.module,
      action: perm.action,
    }));
  } catch (error) {
    console.error("Error fetching detailed permissions:", error);
    return [];
  }
};

/**
 * Check if a user role has a specific permission
 * @param userRoleName - The role name/slug of the user
 * @param module - The module/resource to check (e.g., 'users', 'products')
 * @param action - The action to check (e.g., 'create', 'read', 'update', 'delete')
 * @returns Boolean indicating if the user has the permission
 */
export const hasPermission = async (
  userRoleName: string,
  module: string,
  action: string,
): Promise<boolean> => {
  try {
    const role = await Role.findOne({
      where: {
        slug: userRoleName.toLowerCase(),
      },
      include: [
        {
          model: Permission,
          as: "permissions",
          where: {
            module: module.toLowerCase(),
            action: action.toLowerCase(),
          },
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    if (!role) {
      return false;
    }

    const permissions = (role as any).permissions || [];
    return permissions.length > 0;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};
