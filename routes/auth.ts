import { Router } from "express";
import { login, registration } from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/registration", registration);

export default authRouter;
