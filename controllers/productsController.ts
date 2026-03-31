import { Request, Response } from "express";
import Product from "../models/product";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, price, categoryId, image } = req.body;

    // Validate required fields
    if (!name || !price) {
      res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
      return;
    }

    // Trim strings to handle whitespace
    const trimmedName = name.trim();
    // const trimmedCategoryId = String(categoryId).trim();

    // Validate name is not empty
    if (!trimmedName) {
      res.status(400).json({
        success: false,
        message: "Name cannot be empty",
      });
      return;
    }

    // Validate price is a positive number
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      res.status(400).json({
        success: false,
        message: "Price must be a positive number",
      });
      return;
    }

    // Validate categoryId is a valid positive integer
    // const categoryIdNum = parseInt(trimmedCategoryId);
    // if (
    //   isNaN(categoryIdNum) ||
    //   categoryIdNum <= 0 ||
    //   !Number.isInteger(categoryIdNum)
    // ) {
    //   res.status(400).json({
    //     success: false,
    //     message: "CategoryId must be a valid positive integer",
    //   });
    //   return;
    // }

    const categoryIdNum = categoryId ? Number(categoryId) : null;

    // Create the product in database
    const newProduct = await Product.create({
      name: trimmedName,
      price: priceNum,
      categoryId: categoryIdNum,
      image: image?.trim() || null,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        categoryId: newProduct.categoryId,
        image: newProduct.image,
        createdAt: newProduct.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, image } = req.body;

    // Validate product ID
    const productId = parseInt(String(id));
    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
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
      updateData.name = trimmedName;
    }

    // Validate and add price if provided
    if (price !== undefined) {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        res.status(400).json({
          success: false,
          message: "Price must be a positive number",
        });
        return;
      }
      updateData.price = priceNum;
    }

    // Handle categoryId if provided
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId ? Number(categoryId) : null;
    }

    // Handle image if provided
    if (image !== undefined) {
      updateData.image = image ? image.trim() : null;
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
      return;
    }

    // Update the product
    await product.update(updateData);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        image: product.image,
        createdAt: product.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate product ID
    const productId = parseInt(String(id));
    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    // Find product by ID
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        image: product.image,
        createdAt: product.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate product ID
    const productId = parseInt(String(id));
    if (isNaN(productId) || productId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    // Delete the product
    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};

export const getAllProducts = async (
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

    // Fetch products with pagination
    const { count, rows: products } = await Product.findAndCountAll({
      limit: perPage,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / perPage);

    res.status(200).json({
      success: true,
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        image: product.image,
        createdAt: product.createdAt,
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
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
};
