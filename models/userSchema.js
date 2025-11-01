import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: String,
    },
    gender: {
      type: String,
    },
    familyMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Family",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
