import { Request, Response } from "express";
import User from "../models/user";
import { Op, WhereOptions, Order } from "sequelize";
import {
  GetUsersQuery,
  CreateUserDTO,
  UserAttributes,
  ApiResponse,
  PaginatedResponse,
  UserResponseDTO,
  UserRole,
} from "../types/user";

export const getUsers = async (
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response<ApiResponse<PaginatedResponse<UserResponseDTO>>>,
): Promise<void> => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page || "1");
    const limit = Math.min(parseInt(req.query.limit || "10"), 100);
    const search = req.query.search;
    const sortBy = req.query.sortBy || "createdAt";
    const order = (req.query.order?.toUpperCase() as "ASC" | "DESC") || "DESC";

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      res.status(400).json({
        success: false,
        message:
          "Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100",
      });
      return;
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build where clause for search with proper typing
    let whereClause: WhereOptions<UserAttributes> = {};
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Fetch users with pagination and filtering
    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[sortBy, order]] as Order,
      attributes: { exclude: ["password"] },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users: users.map((user) => user.toJSON() as UserResponseDTO),
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createUser = async (
  req: Request<{}, {}, CreateUserDTO>,
  res: Response<ApiResponse<UserResponseDTO>>,
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, email, password, and role are required",
      });
      return;
    }

    // Validate role
    const validRoles = Object.values(UserRole);
    if (!validRoles.includes(role.toLowerCase() as UserRole)) {
      res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    // Validate name length
    if (typeof name !== "string" || name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Create new user
    const newUser = await User.create({ name, email, password, role });

    // Remove password from response
    const { password: _, ...userResponse } = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse as UserResponseDTO,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: "Failed to create user",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
