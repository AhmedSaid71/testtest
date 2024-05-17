import express from "express";
import { updateMe, getMe } from "../controllers";
import { protect } from "../middlewares";
import { updateUserValidator } from "../utils";

const router = express.Router();

router.use(protect);

router.get("/me", getMe);
router.patch("/updateMe", updateUserValidator, updateMe);

export default router;
