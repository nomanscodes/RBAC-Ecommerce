import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";
import { MODULES, ACTIONS } from "../types/constants";
import {
  createProduct,
  updateProduct,
  getProduct,
  deleteProduct,
  getAllProducts,
} from "../controllers/productsController";
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
router.get("/", getAllProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", getProduct);

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
  updateProduct,
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
  deleteProduct,
);

export default router;
