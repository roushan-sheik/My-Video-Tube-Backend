import mongoose from "mongoose";

const connectDB = async () => {
  // connection string making
  let connectionUri = process.env.MONGO_URI;
  connectionUri = connectionUri.replace(
    "<username>",
    process.env.MONGO_USER_NAME
  );
  connectionUri = connectionUri.replace(
    "<password>",
    process.env.MONGO_USER_PASSWORD
  );
  connectionUri = `${connectionUri}/${process.env.DB_NAME}`;
  try {
    // Check Connection URI
    if (!connectionUri) {
      throw new Error("MONGO_URI is not defined in .env FILE");
    }
    // Check STATE Database Already Connected Or NOT
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
      console.log("Database Already Connected");
      return;
    }
    if (connectionState === 2) {
      console.log("Connecting to the Database...");
      return;
    }
    const connectionInstance = await mongoose.connect(connectionUri);
    console.log(
      `\n MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection FAILED", error.message);
    process.exit(1);
  }
};
export default connectDB;
