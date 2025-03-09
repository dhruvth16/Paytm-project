"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
exports.router = express_1.default.Router();
exports.router.get("/", (req, res) => {
    res.send("From router");
});
exports.router.post('/signup', user_controller_1.userSignup);
exports.router.post('/signin', user_controller_1.userSignin);
