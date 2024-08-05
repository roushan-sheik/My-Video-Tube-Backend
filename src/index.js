// require( "dotenv" ).config( { path: "./env" } );
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config();

// App listening port
const PORT = process.env.PORT || 8000;
// connect to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App is running on port: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection FAILED!!", error);
  });
