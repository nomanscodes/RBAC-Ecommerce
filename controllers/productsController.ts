import { Request, Response } from "express";
import Product from "../models/product";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, price, categoryId, image } = req.body;

    // Validate required fields
    if (!name || !price || !categoryId) {
      res.status(400).json({
        success: false,
        message: "Name, price, and categoryId are required",
      });
      return;
    }

    // Trim strings to handle whitespace
    const trimmedName = name.trim();
    const trimmedCategoryId = String(categoryId).trim();

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
    const categoryIdNum = parseInt(trimmedCategoryId);
    if (
      isNaN(categoryIdNum) ||
      categoryIdNum <= 0 ||
      !Number.isInteger(categoryIdNum)
    ) {
      res.status(400).json({
        success: false,
        message: "CategoryId must be a valid positive integer",
      });
      return;
    }

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
