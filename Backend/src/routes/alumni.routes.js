import express from "express";
import { createAlumni, getAlumni } from "../controllers/alumni.controller.js";

const router = express.Router();

router.get("/", getAlumni);
router.post("/", createAlumni);

export default router;
