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
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories with pagination
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get single category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid category ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
