import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";
import { MODULES, ACTIONS } from "../types/constants";
import { createProduct } from "../controllers/productsController";
// import * as productController from "../controllers/productController";

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @route   GET /api/products
 * @desc    Get all products (public - anyone can browse)
 * @access  Public
 */
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Public: Get all products" });
  // productController.getAllProducts(req, res);
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */

router.get("/:id", (req: Request, res: Response) => {
  res.json({ message: `Public: Get product ${req.params.id}` });
  // productController.getProductById(req, res);
});

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private (requires products:create permission)
 */
router.post(
  "/",
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.CREATE),
  createProduct,
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (requires products:update permission)
 */
router.put(
  "/:id",
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE),
  (req: Request, res: Response) => {
    res.json({ message: `Update product ${req.params.id}` });
    // productController.updateProduct(req, res);
  },
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (requires products:delete permission)
 */
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.DELETE),
  (req: Request, res: Response) => {
    res.json({ message: `Delete product ${req.params.id}` });
    // productController.deleteProduct(req, res);
  },
);

/**
 * @route   PATCH /api/products/:id/status
 * @desc    Update product status (publish/unpublish)
 * @access  Private (requires products:update permission)
 */
router.patch(
  "/:id/status",
  authMiddleware,
  checkPermission(MODULES.PRODUCTS, ACTIONS.UPDATE),
  (req: Request, res: Response) => {
    res.json({ message: `Update product ${req.params.id} status` });
    // productController.updateProductStatus(req, res);
  },
);

/**
 * @route   GET /api/products/my/inventory
 * @desc    Get current user's products (sellers only)
 * @access  Private (requires authentication only)
 */
router.get("/my/inventory", authMiddleware, (req: Request, res: Response) => {
  res.json({ message: "Get my products", userId: req.user?.id });
  // productController.getMyProducts(req, res);
});

export default router;
