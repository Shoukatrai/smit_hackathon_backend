import express from "express";
import { getReport, getSingleReport, uploadReport } from "../controllers/report.js";
import upload from "../middlewares/multer.js";
import { verifyToken } from "../middlewares/auth.js";

const router = express.Router();

router.post(
    "/upload",
    verifyToken,
    upload.single("file"),
    uploadReport
);
router.get(
    "/get_report/:id",
    verifyToken,
    getSingleReport
);
router.get(
    "/get_report",
    verifyToken,
    getReport
);




export default router;
