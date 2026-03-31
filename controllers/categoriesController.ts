import { Request, Response } from "express";
import Category from "../models/category";

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      res.status(400).json({
        success: false,
        message: "Name is required",
      });
      return;
    }

    // Trim and validate name
    const trimmedName = name.trim();
    if (!trimmedName) {
      res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
      return;
    }

    // Check if category with same name already exists
    const existingCategory = await Category.findOne({
      where: { name: trimmedName },
    });

    if (existingCategory) {
      res.status(409).json({
        success: false,
        message: "Category with this name already exists",
      });
      return;
    }

    // Create the category in database
    const newCategory = await Category.create({
      name: trimmedName,
      description: description?.trim() || null,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        id: newCategory.id,
        name: newCategory.name,
        description: newCategory.description,
        createdAt: newCategory.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate category ID
    const categoryId = parseInt(String(id));
    if (isNaN(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    // Prepare update data
    const updateData: any = {};

    // Validate and add name if provided
    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) {
        res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
        return;
      }

      // Check if another category with same name exists
      const existingCategory = await Category.findOne({
        where: { name: trimmedName },
      });

      if (existingCategory && existingCategory.id !== categoryId) {
        res.status(409).json({
          success: false,
          message: "Category with this name already exists",
        });
        return;
      }

      updateData.name = trimmedName;
    }

    // Handle description if provided
    if (description !== undefined) {
      updateData.description = description ? description.trim() : null;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
      return;
    }

    // Update the category
    await category.update(updateData);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate category ID
    const categoryId = parseInt(String(id));
    if (isNaN(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    // Find category by ID
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate category ID
    const categoryId = parseInt(String(id));
    if (isNaN(categoryId) || categoryId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    // Delete the category
    await category.destroy();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Extract pagination parameters from query string
    const page = parseInt(String(req.query.page)) || 1;
    const perPage = parseInt(String(req.query.perPage)) || 10;

    // Validate pagination parameters
    if (page < 1) {
      res.status(400).json({
        success: false,
        message: "Page must be greater than 0",
      });
      return;
    }

    if (perPage < 1 || perPage > 100) {
      res.status(400).json({
        success: false,
        message: "perPage must be between 1 and 100",
      });
      return;
    }

    // Calculate offset
    const offset = (page - 1) * perPage;

    // Fetch categories with pagination
    const { count, rows: categories } = await Category.findAndCountAll({
      limit: perPage,
      offset: offset,
      order: [["name", "ASC"]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / perPage);

    res.status(200).json({
      success: true,
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
      })),
      pagination: {
        currentPage: page,
        perPage: perPage,
        totalItems: count,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
