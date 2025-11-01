import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  addFamilyMember,
  getFamilyMember,
} from "../controllers/addFamilyMember.js";

const router = express.Router();

router.post("/upload", verifyToken, addFamilyMember);
router.get("/get", verifyToken, getFamilyMember);

export default router;
