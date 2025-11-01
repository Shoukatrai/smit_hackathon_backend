import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import Report from "../models/reportSchema.js";
import redisClient from "../config/redis.js";
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
const urlToGenerativePart = async (url, mimeType) => {
  const res = await axios.get(url, { responseType: "arraybuffer" });
  return {
    inlineData: { data: Buffer.from(res.data).toString("base64"), mimeType },
  };
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const uploadReport = async (req, res) => {
  try {
    console.log("Report upload request hit");
    console.log(req.user.id);
    const { reportName, family } = req.body;
    console.log("reportName", reportName);
    console.log("family", family);
    console.log(req.body);
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "No file provided",
      });
    }
    const { buffer, originalname, mimetype } = req.file;
    console.log("File received:", originalname, mimetype);
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "healthmate_reports",
            resource_type: "auto",
            public_id: originalname.split(".")[0],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(buffer);
      });

    const result = await uploadToCloudinary();
    const fileUrl = result.secure_url;
    console.log("fileUrl", fileUrl);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert medical report analyzer.

Analyze the uploaded medical report (image or PDF). Extract and interpret all measurable data and diagnostic information. 
Provide a structured response in **valid JSON only** — no markdown, no text outside JSON. 
If any field is not applicable, leave it as an empty string or empty array.

Use this schema exactly:

{
  "summary": "Concise 2-3 line English summary of key findings",
  "romanUrduSummary": "Accurate Roman Urdu translation of the English summary",
  "abnormalValues": [
    {
      "parameter": "Name of abnormal test or metric",
      "value": "Numeric or textual result",
      "remark": "Interpretation (e.g., High, Low, Normal, Critical)"
    }
  ],
  "doctorQuestions": [
    "List 2-3 relevant questions the patient can ask a doctor about these results"
  ],
  "foodSuggestions": "List specific dietary recommendations in simple English",
  "homeRemedies": "List safe home remedies (if relevant) in simple English"
}

Rules:
- Output **only** valid JSON.
- Do not add explanations or comments.
- If the report is unreadable or unclear, respond with placeholders and a note in 'summary'.
`;

    const imagePart = await urlToGenerativePart(fileUrl, mimetype);
    const aiResult = await model.generateContent([prompt, imagePart]);
    const text = (await aiResult.response.text())
      .replace(/```json|```/g, "")
      .trim();
    let data;
    console.log("text", text);
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ message: "Error parsing AI response" });
    }
    const savedObj = {
      reportName: reportName || req.file.originalname.split(".")[0],
      reportDate: new Date(),
      userId: req.user.id,
      family,
      filePath: fileUrl,
      aiSummary: data.summary || "",
      aiRomanUrduSummary: data.romanUrduSummary || "",
      abnormalParameters: data.abnormalValues?.map((v) => v.parameter) || [],
      abnormalValues: data.abnormalValues?.map((v) => v.value) || [],
      abnormalRemarks: data.abnormalValues?.map((v) => v.remark) || [],
      doctorQuestions: data.doctorQuestions || [],
      foodSuggestions: data.foodSuggestions || "",
      homeRemedies: data.homeRemedies || "",
      reportUrl:fileUrl
    };

    const response = await Report.create(savedObj);
    await redisClient.del("/get_report")
    return res.status(200).json({
      status: true,
      message: "Uploaded successfully",
      url: data,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Cloud upload failed",
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
    return res.status(200).json({
        data: reports,
        message: "Return from Controller.",
        status: true,
      });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

export const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    console.log("report", report);
    if (!report)
      return res
        .status(404)
        .json({ status: false, message: "Report not found" });

    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: false, message: "Access denied" });
    }

    res.json({ status: true, data: report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};
