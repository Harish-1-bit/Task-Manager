import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// All task routes are protected by admin JWT
router.use(authMiddleware);

// Task CRUD routes
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;

