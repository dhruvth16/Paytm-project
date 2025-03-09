"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSignin = exports.userSignup = void 0;
const zod_1 = require("zod");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        username: zod_1.z.string().min(3, { message: "username must be at least 3 characters long" }),
        password: zod_1.z
            .string()
            .min(8, { message: "password must atleast 8 characters long" })
            .max(100)
            .refine((password) => /[A-Z]/.test(password), {
            message: "uppercaseErrorMessage",
        })
            .refine((password) => /[a-z]/.test(password), {
            message: "lowercaseErrorMessage",
        })
            .refine((password) => /[0-9]/.test(password), {
            message: "numberErrorMessage",
        })
            .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "specialCharacterErrorMessage",
        }),
        firstname: zod_1.z.string().min(3),
        lastname: zod_1.z.string().min(3).optional()
    });
    const safeParsedData = requiredBody.safeParse(req.body);
    if (!safeParsedData.success) {
        res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }
    const { username, password, firstname, lastname } = req.body;
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const userAlreadyExist = yield user_model_1.userModel.findOne({ username });
    if (userAlreadyExist) {
        res.status(400).json({
            message: "User already exists!"
        });
    }
    try {
        const user = yield user_model_1.userModel.create({
            username,
            password: hashedPassword,
            firstname,
            lastname
        });
        res.status(201).json({
            message: "User created!",
            user
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!"
        });
    }
});
exports.userSignup = userSignup;
const userSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        username: zod_1.z.string().min(3, { message: "username must be at least 3 characters long" }),
        password: zod_1.z
            .string()
            .min(8, { message: "password must atleast 8 characters long" })
            .max(100)
            .refine((password) => /[A-Z]/.test(password), {
            message: "uppercaseErrorMessage",
        })
            .refine((password) => /[a-z]/.test(password), {
            message: "lowercaseErrorMessage",
        })
            .refine((password) => /[0-9]/.test(password), {
            message: "numberErrorMessage",
        })
            .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "specialCharacterErrorMessage",
        }),
    });
    const safeParsedData = requiredBody.safeParse(req.body);
    if (!safeParsedData.success) {
        res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }
    const { username, password } = req.body;
    try {
        const existingUser = yield user_model_1.userModel.findOne({
            username
        });
        if (!existingUser) {
            res.status(404).json({
                message: "User does not exist!"
            });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingUser === null || existingUser === void 0 ? void 0 : existingUser.password);
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Incorrect password!"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            id: existingUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });
        res.status(200).json({
            message: "User signed in successfully!",
            token
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal server error!"
        });
    }
});
exports.userSignin = userSignin;
