import express from "express"
import { authMiddleware } from "../middleware/auth.middleware";
import { getAccountBalance, transferMoney } from "../controllers/account.controller";

export const router = express.Router();

router.get("/balance", authMiddleware, getAccountBalance)
router.post("/transfer", authMiddleware, transferMoney)

