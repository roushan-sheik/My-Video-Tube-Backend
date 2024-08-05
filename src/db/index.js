import mongoose from "mongoose";
import { DB_NAME } from "./../constants.js";

const connectDB = async () => {
  try {
    const dbURI = `${process.env.MONGO_URI}/${DB_NAME}`;
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    const connectionInstance = await mongoose.connect(dbURI);
    console.log(
      `\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection FAILED", error.message);
    process.exit(1);
  }
};
export default connectDB;
