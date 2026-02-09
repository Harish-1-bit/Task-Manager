import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// DB
connectDB();


const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping admin seeding.");
      return;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return;
    }

    await User.create({ email, password, role: "admin" });
    console.log(`Seeded admin user: ${email}`);
  } catch (err) {
    console.error("Error seeding admin user:", err.message);
  }
};

seedAdmin();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.send("Mini Task Management API is running");
});


app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

