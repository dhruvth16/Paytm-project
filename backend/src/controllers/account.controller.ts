import { json, Request, Response } from "express";
import { CustomRequest } from "../middleware/auth.middleware";
import { accountModel } from "../models/account.model";
import mongoose from "mongoose";

export const getAccountBalance = async (req: CustomRequest, res: Response) => {
    const userId = req.userId

    try {
        const accBalance = await accountModel.findOne({
            userId
        })
    
        res.status(200).json({
            balance: accBalance
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error fetching account "
        })
    }
}

export const transferMoney = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;

    try {
        const session = await mongoose.startSession()
    
        session.startTransaction()
        const { amount, to } = req.body;
         
        // from which the transaction is starting
        const account = await accountModel.findOne({
            userId: userId
        }).session(session)
    
        if ( !account || account.balance < amount ) {
            res.status(400).json({
                message: "Insufficient balance"
            })
            return
        }
        
        // to which the trransaction is ending
        const toAccount = await accountModel.findOne({
            userId: to
        }).session(session)
    
        if (!toAccount) {
            res.status(400).json({
                message: "Invalid account"
            })
            return
        }
    
        await accountModel.updateOne(
            {
                userId: userId
            },
            {
                $inc: {
                    balance: -amount
                }
            }
        ).session(session)
    
        await accountModel.updateOne(
            {
                userId: to
            },
            {
                $inc: {
                    balance: amount
                }
            }
        ).session(session)
    
        await session.commitTransaction()
        res.status(200).json({
            message: "Transaction successfull"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error while transaction"
        })
    }
}