import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({ title });
    return res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getTasks = async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { completed, title } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (typeof completed === "boolean") {
      task.completed = completed;
    }
    if (typeof title === "string") {
      task.title = title;
    }

    const updated = await task.save();
    return res.status(200).json(updated);
  } catch (error) {
    console.error("Update task error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

