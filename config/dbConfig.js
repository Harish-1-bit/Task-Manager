import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `database successfully connected ${conn.connection.name}`
    );
  } catch (error) {
    console.log("database connection failed", error);
  }
};

export default connectDB;