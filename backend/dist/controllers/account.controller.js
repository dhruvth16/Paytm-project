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
exports.transferMoney = exports.getAccountBalance = void 0;
const account_model_1 = require("../models/account.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getAccountBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const accBalance = yield account_model_1.accountModel.findOne({
            userId
        });
        res.status(200).json({
            balance: accBalance
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error fetching account "
        });
    }
});
exports.getAccountBalance = getAccountBalance;
const transferMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        const { amount, to } = req.body;
        // from which the transaction is starting
        const account = yield account_model_1.accountModel.findOne({
            userId: userId
        }).session(session);
        if (!account || account.balance < amount) {
            res.status(400).json({
                message: "Insufficient balance"
            });
            return;
        }
        // to which the trransaction is ending
        const toAccount = yield account_model_1.accountModel.findOne({
            userId: to
        }).session(session);
        if (!toAccount) {
            res.status(400).json({
                message: "Invalid account"
            });
            return;
        }
        yield account_model_1.accountModel.updateOne({
            userId: userId
        }, {
            $inc: {
                balance: -amount
            }
        }).session(session);
        yield account_model_1.accountModel.updateOne({
            userId: to
        }, {
            $inc: {
                balance: amount
            }
        }).session(session);
        yield session.commitTransaction();
        res.status(200).json({
            message: "Transaction successfull"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error while transaction"
        });
    }
});
exports.transferMoney = transferMoney;
