import mongoose from "mongoose";

const familySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    reports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
        default: [],
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    relation: {
      type: String,
      enum: [
        "father",
        "mother",
        "sister",
        "brother",
        "grand_father",
        "grandmother",
      ],
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    age: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Family", familySchema);
