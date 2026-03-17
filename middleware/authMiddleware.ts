import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    console.log("Decoded JWT payload:", decoded); // Debugging log

    // Attach user info to request object
    // req.user = decoded as { id: number; role: string };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
