# Where to Apply Middleware - Quick Reference Guide

## 🎯 3 Levels of Middleware Application

### ✅ **LEVEL 1: Per-Route (RECOMMENDED)**

Apply different permissions to different routes

```typescript
// routes/products.ts
router.get("/", (req, res) => {}); // Public

router.post(
  "/",
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
  (req, res) => {},
); // Protected

router.delete(
  "/:id",
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.DELETE),
  (req, res) => {},
); // Protected with different permission
```

**Pros:**

- ✅ Most flexible
- ✅ Mix public/private routes
- ✅ Different permissions per route
- ✅ Clear and explicit

**Use when:** Different routes need different permissions

---

### ⚠️ **LEVEL 2: Router-Level (USE CAREFULLY)**

Apply to all routes in a router

```typescript
// routes/admin.ts
const router = Router();

// Apply to ALL admin routes
router.use(authMiddleware);

router.get("/dashboard", (req, res) => {}); // All protected
router.get("/users", (req, res) => {}); // All protected
router.get("/reports", (req, res) => {}); // All protected
```

**Pros:**

- ✅ Less repetition
- ✅ Good for admin-only sections

**Cons:**

- ❌ ALL routes must be protected
- ❌ Can't mix public/private

**Use when:** ALL routes need same middleware (e.g., admin panel)

---

### ❌ **LEVEL 3: App-Level (AVOID)**

Apply to everything

```typescript
// app.ts
app.use(authMiddleware); // ❌ BAD - blocks ALL routes including auth routes!

app.use("/api/auth", authRouter); // ❌ Can't login anymore!
app.use("/api/products", productsRouter); // ❌ Can't browse products!
```

**Use when:** Almost never (only for logging, cors, body-parser)

---

## 📋 Decision Tree: Where to Apply Middleware?

```
Are ALL routes in this router protected?
├─ YES → Use router.use(authMiddleware)
└─ NO → Apply per route

Do different routes need different permissions?
├─ YES → Apply per route with specific permissions
└─ NO → Use router.use() with common permission

Is this an admin or special section?
├─ YES → Create separate router, use router.use()
└─ NO → Apply per route
```

---

## 🎯 Common Patterns

### Pattern 1: Mixed Public/Private (E-commerce)

```typescript
// routes/products.ts
router.get("/", controller.browse); // Public
router.get("/:id", controller.view); // Public
router.post("/", auth, perm, controller.create); // Private
router.put("/:id", auth, perm, controller.update); // Private
router.delete("/:id", auth, perm, controller.delete); // Private
```

### Pattern 2: All Protected (Admin Panel)

```typescript
// routes/admin.ts
router.use(authMiddleware); // All need auth
router.get("/dashboard", controller.dashboard);
router.get("/users", perm, controller.users);
router.get("/reports", perm, controller.reports);
```

### Pattern 3: Public API with Optional Auth

```typescript
// routes/products.ts
router.get("/", optionalAuth, controller.browse); // Public but enhanced if logged in
```

---

## 🚀 Your Current Setup (BEST PRACTICE)

### app.ts (Clean!)

```typescript
app.use("/api", apiRouter); // Single entry point
```

### routes/index.ts (Organized!)

```typescript
router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/users", usersRouter);
```

### routes/products.ts (Flexible!)

```typescript
router.get("/", publicController); // Public
router.post("/", auth, perm, privateController); // Private
router.delete("/:id", auth, perm, privateController); // Private
```

---

## ❌ Common Mistakes to Avoid

### Mistake 1: Auth on Auth Routes

```typescript
app.use("/api/auth", authMiddleware, authRouter); // ❌ Can't login!
```

### Mistake 2: Single Permission for All

```typescript
app.use(
  "/api/products",
  checkPermission("products-read"), // ❌ Can't create/update/delete!
  productsRouter,
);
```

### Mistake 3: Duplicate Middleware

```typescript
// app.ts
app.use('/api/products', authMiddleware, productsRouter);

// products.ts
router.post('/', authMiddleware, ...); // ❌ authMiddleware runs twice!
```

---

## ✅ Best Practices Summary

1. **Apply middleware at the lowest level possible** (per-route)
2. **Use router.use() only when ALL routes need it**
3. **Never use app.use() for authMiddleware**
4. **Document which routes are public/private** (use comments)
5. **Group similar routes** (admin/, seller/, public/)
6. **Use constants for permissions** (no hardcoded strings)

---

## 🎓 Real-World Example

```typescript
// routes/products.ts
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";
import { MODULES, ACTIONS } from "../types/constants";
import * as controller from "../controllers/productController";

const router = Router();

// PUBLIC ROUTES
router.get("/", controller.browse); // Anyone
router.get("/:id", controller.view); // Anyone

// PROTECTED ROUTES
router.post(
  "/", // Sellers & Admins
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
  controller.create,
);

router.put(
  "/:id", // Product owner or Admin
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE),
  controller.update,
);

router.delete(
  "/:id", // Admins only
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.DELETE),
  controller.delete,
);

export default router;
```

This is the **industry standard** approach! 🎯
