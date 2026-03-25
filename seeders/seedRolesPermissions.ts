import sequelize from "../config/db";
import "../models/index"; // Import models and associations
import Role from "../models/role";
import Permission from "../models/permission";
import RolePermission from "../models/rolePermission";

// Define roles to seed
const roles = [
  {
    name: "Super User",
    slug: "superuser",
    description: "Full system access with all permissions",
  },
  {
    name: "Administrator",
    slug: "admin",
    description: "Administrative access to manage system",
  },
  {
    name: "Seller",
    slug: "seller",
    description: "Seller account to manage products and orders",
  },
  {
    name: "Customer",
    slug: "customer",
    description: "Customer account to browse and purchase",
  },
  {
    name: "User",
    slug: "user",
    description: "Basic user account",
  },
];

// Define permissions to seed
const permissions = [
  // User permissions
  {
    name: "Create User",
    slug: "users-create",
    module: "users",
    action: "create",
  },
  { name: "Read User", slug: "users-read", module: "users", action: "read" },
  {
    name: "Update User",
    slug: "users-update",
    module: "users",
    action: "update",
  },
  {
    name: "Delete User",
    slug: "users-delete",
    module: "users",
    action: "delete",
  },

  // Product permissions
  {
    name: "Create Product",
    slug: "products-create",
    module: "products",
    action: "create",
  },
  {
    name: "Read Product",
    slug: "products-read",
    module: "products",
    action: "read",
  },
  {
    name: "Update Product",
    slug: "products-update",
    module: "products",
    action: "update",
  },
  {
    name: "Delete Product",
    slug: "products-delete",
    module: "products",
    action: "delete",
  },

  // Order permissions
  {
    name: "Create Order",
    slug: "orders-create",
    module: "orders",
    action: "create",
  },
  { name: "Read Order", slug: "orders-read", module: "orders", action: "read" },
  {
    name: "Update Order",
    slug: "orders-update",
    module: "orders",
    action: "update",
  },
  {
    name: "Delete Order",
    slug: "orders-delete",
    module: "orders",
    action: "delete",
  },

  // Category permissions
  {
    name: "Create Category",
    slug: "categories-create",
    module: "categories",
    action: "create",
  },
  {
    name: "Read Category",
    slug: "categories-read",
    module: "categories",
    action: "read",
  },
  {
    name: "Update Category",
    slug: "categories-update",
    module: "categories",
    action: "update",
  },
  {
    name: "Delete Category",
    slug: "categories-delete",
    module: "categories",
    action: "delete",
  },

  // Settings permissions
  {
    name: "Read Settings",
    slug: "settings-read",
    module: "settings",
    action: "read",
  },
  {
    name: "Update Settings",
    slug: "settings-update",
    module: "settings",
    action: "update",
  },

  // Reports permissions
  {
    name: "Read Reports",
    slug: "reports-read",
    module: "reports",
    action: "read",
  },
];

// Define role-permission mappings
const rolePermissionMappings = {
  superuser: [
    "users-create",
    "users-read",
    "users-update",
    "users-delete",
    "products-create",
    "products-read",
    "products-update",
    "products-delete",
    "orders-create",
    "orders-read",
    "orders-update",
    "orders-delete",
    "categories-create",
    "categories-read",
    "categories-update",
    "categories-delete",
    "settings-read",
    "settings-update",
    "reports-read",
  ],
  admin: [
    "users-read",
    "users-update",
    "products-create",
    "products-read",
    "products-update",
    "products-delete",
    "orders-create",
    "orders-read",
    "orders-update",
    "categories-create",
    "categories-read",
    "categories-update",
    "categories-delete",
    "reports-read",
  ],
  seller: [
    "products-create",
    "products-read",
    "products-update",
    "orders-read",
    "orders-update",
    "categories-read",
  ],
  customer: [
    "products-read",
    "orders-create",
    "orders-read",
    "categories-read",
  ],
  user: ["products-read", "orders-create", "orders-read", "categories-read"],
};

async function seedRolesAndPermissions() {
  try {
    console.log("Starting database seeding...");

    // Authenticate database connection
    await sequelize.authenticate();
    console.log("✓ Database connected");

    // Sync models
    await sequelize.sync();
    console.log("✓ Models synced");

    // Clear existing data (optional - comment out if you want to keep existing data)
    // await RolePermission.destroy({ where: {} });
    // await Role.destroy({ where: {} });
    // await Permission.destroy({ where: {} });

    // Seed roles
    console.log("\nSeeding roles...");
    const createdRoles: { [key: string]: Role } = {};
    for (const roleData of roles) {
      const [role] = await Role.findOrCreate({
        where: { slug: roleData.slug },
        defaults: roleData,
      });
      createdRoles[roleData.slug] = role;
      console.log(`  ✓ Role: ${roleData.name} (${roleData.slug})`);
    }

    // Seed permissions
    console.log("\nSeeding permissions...");
    const createdPermissions: { [key: string]: Permission } = {};
    for (const permData of permissions) {
      const [permission] = await Permission.findOrCreate({
        where: { slug: permData.slug },
        defaults: permData,
      });
      createdPermissions[permData.slug] = permission;
      console.log(`  ✓ Permission: ${permData.name} (${permData.slug})`);
    }

    // Seed role-permission mappings
    console.log("\nAssigning permissions to roles...");
    for (const [roleSlug, permissionSlugs] of Object.entries(
      rolePermissionMappings,
    )) {
      const role = createdRoles[roleSlug];
      if (!role) continue;

      console.log(`\n  Role: ${roleSlug}`);
      for (const permSlug of permissionSlugs) {
        const permission = createdPermissions[permSlug];
        if (!permission) continue;

        await RolePermission.findOrCreate({
          where: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
        console.log(`    ✓ ${permSlug}`);
      }
    }

    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

// Run seeder
seedRolesAndPermissions();
