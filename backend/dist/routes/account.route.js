"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const account_controller_1 = require("../controllers/account.controller");
exports.router = express_1.default.Router();
exports.router.get("/balance", auth_middleware_1.authMiddleware, account_controller_1.getAccountBalance);
exports.router.post("/transfer", auth_middleware_1.authMiddleware, account_controller_1.transferMoney);
