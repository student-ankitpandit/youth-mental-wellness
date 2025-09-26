import { Router } from 'express';
import z  from 'zod';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import { prisma } from '../lib/prisma';

const router = Router();

router.post("/signup", async (req, res) => {
    try {
        const signupSchema =  z.object({
            username: z.string().min(3, "Username must be at least 3 characters"),
            email: z.email(),
            password: z.string().min(6, "Password must be at least 6 characters")
        })

        const result = signupSchema.safeParse(req.body)
        if(!result.success) {
            console.log("Validation: ", result.error.issues)
            return res.status(400).json({success: false, errors: result.error.issues})
        }

        const {username, email, password} = result.data;
        console.log(result.data);

        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if(existingUser) {
            return res
            .status(400)
            .json({success: false, message: "User with this email already exist"})
        }

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

router.post("/login", async (req, res) => {
    try {
        const loginSchema = z.object({
            email: z.email("Invalid email address"),
            password: z.string().min(6, "Password must be at least 6 characters")
        })

        const result = loginSchema.safeParse(req.body)
        if(!result.success) {
            return res.status(400).json({success: false, errors: result.error.issues})
        }

        const {email, password} = result.data
        console.log(result.data);

        //find the user in db
        const user = await prisma.user.findUnique({ where: {email} })

        if(!user) {
            return res
            .status(404)
            .json({success: false, message: "User not found"})
        }

        const validPassword = await bcrypt.compare(password, user.password) //user.password is the salt of the register password in signup route
        
        if(!validPassword) {
            return res
            .status(401)
            .json({success: false, message: "Invalid credentials"})
        }

        //signing jwt token
        const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET!)

        return res
        .status(200)
        .json({success: true, message: "User logged in successfully", token: token, user: {id: user.id, email: user.email, pass: user.password}})
        
    } catch (e) {
        console.log("Error: ", e)
        return res.status(500).json({success: false, message: "Something went wrong while signing you in"})
    }
})

export default router
