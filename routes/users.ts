import { Express } from "express";
import { Router } from "express";
import { createUser, getUsers } from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.post("/", createUser);

export default userRouter;
