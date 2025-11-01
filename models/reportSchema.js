import mongoose, { model } from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportName: {
      type: String,
      required: true,
      trim: true,
    },
    reportUrl: {
      type: String,
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    familyMember: {
      type: String,
      default: "",
    },
    filePath: {
      type: String,
      required: true,
    },
    aiSummary: {
      type: String,
      default: "",
    },
    aiRomanUrduSummary: {
      type: String,
      default: "",
    },

    abnormalParameters: {
      type: [String],
      default: [],
    },
    abnormalValues: {
      type: [String],
      default: [],
    },
    abnormalRemarks: {
      type: [String],
      default: [],
    },

    doctorQuestions: {
      type: [String],
      default: [],
    },
    foodSuggestions: {
      type: String,
      default: "",
    },
    homeRemedies: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
// export default mongoose.model("Report", reportSchema);
