import { bcrypt } from "b";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // Cloudinary url
      required: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: true,
    },
  },
  { timestamps: true }
);
// middleware
// Hash user password before save the user
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hash(this.password, 10);
    next();
  }
  next();
});
// mongoose custom method for compare password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = model("User", userSchema);
