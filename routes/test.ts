import { Router } from "express";

const testRouter = Router();

testRouter.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" });
});

export default testRouter;
