import { Request, Response } from "express";

export const testController = (req: Request, res: Response): void => {
  res.json({ message: "Test route is working!" });
};
