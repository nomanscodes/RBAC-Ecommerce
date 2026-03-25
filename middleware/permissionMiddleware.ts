import { Request, Response, NextFunction } from "express";
import { hasPermission } from "../utils/getRolesPermissions";

/**
 * Permission middleware - checks if user has required permission
 * Supports two usage modes:
 * 1. checkPermission('users-create') - Check by permission slug
 * 2. checkPermission('users', 'create') - Check by module and action
 */

export const checkPermission = (moduleOrSlug: string, action?: string) => {
  console.log("Permission middleware initialized with:", moduleOrSlug, action);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Ensure user is authenticated
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = req.user.role;

      // Determine module and action
      let module: string;
      let permAction: string;

      // Mode 2: checkPermission('users', 'create')
      if (action) {
        module = moduleOrSlug;
        permAction = action;

        // Mode 1: checkPermission('users-create')
        // Parse slug format: 'module-action'
      } else {
        const parts = moduleOrSlug.split("-");
        if (parts.length < 2) {
          return res.status(500).json({
            success: false,
            message: "Invalid permission format",
          });
        }
        permAction = parts.pop() as string;
        module = parts.join("-");
      }

      // Check permission from database
      const hasAccess = await hasPermission(userRole, module, permAction);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You don't have permission to perform this action",
          required: `${module}:${permAction}`,
        });
      }

      // User has permission, proceed
      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking permissions",
      });
    }
  };
};

/**
 * Check multiple permissions (user must have ALL)
 */
export const checkPermissions = (permissions: string[][]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = req.user.role;

      // Check all permissions
      for (const [module, action] of permissions) {
        const hasAccess = await hasPermission(userRole, module, action);
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: "Forbidden: Insufficient permissions",
            required: `${module}:${action}`,
          });
        }
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking permissions",
      });
    }
  };
};

/**
 * Check if user has ANY of the given permissions
 */
export const checkAnyPermission = (permissions: string[][]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = req.user.role;
      let hasAnyAccess = false;

      // Check if user has ANY of the permissions
      for (const [module, action] of permissions) {
        const hasAccess = await hasPermission(userRole, module, action);
        if (hasAccess) {
          hasAnyAccess = true;
          break;
        }
      }

      if (!hasAnyAccess) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You don't have any of the required permissions",
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking permissions",
      });
    }
  };
};
