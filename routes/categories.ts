import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";
import { MODULES, ACTIONS } from "../types/constants";
import {
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/categoriesController";

const router = Router();

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @route   GET /api/categories
 * @desc    Get all categories with pagination
 * @access  Public
 */
router.get("/", getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
router.get("/:id", getCategory);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private (requires categories:create permission)
 */
router.post(
  "/",
  authMiddleware,
  checkPermission(MODULES.CATEGORIES, ACTIONS.CREATE),
  createCategory,
);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (requires categories:update permission)
 */
router.put(
  "/:id",
  authMiddleware,
  checkPermission(MODULES.CATEGORIES, ACTIONS.UPDATE),
  updateCategory,
);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (requires categories:delete permission)
 */
router.delete(
  "/:id",
  authMiddleware,
  checkPermission(MODULES.CATEGORIES, ACTIONS.DELETE),
  deleteCategory,
);

export default router;
