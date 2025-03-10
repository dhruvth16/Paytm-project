import { Request, Response } from "express";
import { z } from 'zod'
import { userModel } from "../models/user.model";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import { CustomRequest } from "../middleware/auth.middleware";
import { accountModel } from "../models/account.model";


export const userSignup = async (req: Request, res: Response) => {
    const requiredBody = z.object({
        username: z.string().min(3, { message: "username must be at least 3 characters long" }),
        password: z
        .string()
        .min(8, {message: "password must atleast 8 characters long"})
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
        firstname: z.string().min(3),
        lastname: z.string().min(3).optional() 
    })

    const safeParsedData = requiredBody.safeParse(req.body)
    if (!safeParsedData.success) {
         res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }

    const { username, password, firstname, lastname } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const userAlreadyExist = await userModel.findOne({username})
    if (userAlreadyExist) {
        res.status(400).json({
            message: "User already exists!"
        })
    }

    const balance = 1 + Math.random() * 10000;

    try {
        const user = await userModel.create({
            username,
            password: hashedPassword,
            firstname,
            lastname
        })

        const userId = user._id;
        await accountModel.create({
            userId,
            balance: balance
        })

        const token = jwt.sign({
            userId
        }, process.env.JWT_SECRET as string)
    
        res.status(201).json({
            message: "User created!",
            token: token,
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error!"
        })
    }   
}

export const userSignin = async (req: Request, res: Response) => {
    const requiredBody = z.object({
        username: z.string().min(3, { message: "username must be at least 3 characters long" }),
        password: z
        .string()
        .min(8, {message: "password must atleast 8 characters long"})
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
    })

    const safeParsedData = requiredBody.safeParse(req.body)
    if (!safeParsedData.success) {
         res.status(401).json({
            message: "Incorrect credentials!",
            error: safeParsedData.error,
        });
        return;
    }

    const { username, password } = req.body;

    try {
        const existingUser = await userModel.findOne({
            username
        })
        if(!existingUser) {
            res.status(404).json({
                message: "User does not exist!"
            })
            return
        }
    
        const isPasswordCorrect = await bcrypt.compare(password, existingUser?.password as string)
        if (!isPasswordCorrect) {
            res.status(401).json({
                message: "Incorrect password!"
            })
            return
        }
    
        const token = jwt.sign(
            {
            id: existingUser._id
            },
                process.env.JWT_SECRET as string,
            {
                expiresIn: '1d'
            }
        )
    
        res.status(200).json({
            message: "User signed in successfully!",
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}

export const updateUser = async (req: CustomRequest, res: Response) => {
    const userId = req.userId;

    const updateBody = z.object({
	    password: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
    })

    if (!userId) {
        res.status(404).json({
            message: "User not found with this id"
        })
        return;
    }

    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    try {
        await userModel.updateOne({ _id: userId }, req.body)
    
        res.status(201).json({
            message: "User updated successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Error updating the user"
        })
    }
}

export const getUser = async (req: CustomRequest, res: Response) => {
    const filter = req.params.filter || "";

    try {
        const users = userModel.find({
            $or: [{
                    firstname: {
                        "$regex": filter
                    }
                },
                {
                    lastname: {
                        "$regex": filter
                    }
                }
            ]
        })

        res.json({
            user: (await users).map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user.id
            }))
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Cannot find users"
        })
    }
}