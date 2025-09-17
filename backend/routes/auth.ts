import { Router } from 'express';
import prisma from '../lib/prisma';
import z, { success } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

const router = Router();

router.post("/signup", async (req:any, res:any) => {
    try {
        const resSchema =  z.object({
            username: z.string().min(3, "Username must be at least 3 characters"),
            email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters")
        })

        const result = resSchema.safeParse(req.body)
        if(!result.success) {
            return res.status(400).json({success: false, errors: result.error.issues})
        }

        const {username, email, password} = result.data;
        console.log(result.data)

        const hashPassword = await bcrypt.hash(password, 10)

        //saving user to db
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword
            }
        })

        return res
        .status(201)
        .json({success: true, message: "User created successfully"})
    } catch (e) {
        console.log("Error in signing you up: ", e);
        return res
        .status(500)
        .json({success: false, message: "Something went wrong while creating your account"})
    }
})

router.post("/login", async (req:any, res:any) => {
    try {
        const resSchema = z.object({
            email: z.email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters")
        })

        const result = resSchema.safeParse(req.body)
        if(!result.success) {
            return res.status(400).json({success: false, errors: result.error.issues})
        }

        const {email, password} = result.data

        //find the user in db
        const user = await prisma.user.findUnique({ where: email })

        if(!user) {
            return res
            .status(404)
            .json({success: false, message: "User not found"})
        }

        const validPassword = await bcrypt.compare(password, user.password) //user.password is the salt of the register password in signup route
        
        if(!validPassword) {
            return res
            .staus(401)
            .json({success: false, message: "Invalid credentials"})
        }

        //signing jwt token
        jwt.sign({userId: user.id}, process.env.JWT_SECRET!)
        
    } catch (e) {
        console.log("Error: ", e)
        return res.staus(500).json({success: false, message: "Something went wrong while signing you in"})
    }
})

