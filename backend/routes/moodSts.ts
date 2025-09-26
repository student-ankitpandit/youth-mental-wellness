import express, { Router } from "express"
import z from "zod"
import prisma from "../lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { authMiddleware } from "../auth-middleware"



const router = Router()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!) //or as string
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"})

router.post("/moodStatus", authMiddleware, async (req, res) => {
    try {
        //validate input
        const moodSchema = z.object({
            userId: z.string(),
            text: z.string().min(3, "Please describe your day")
        })

        const result = moodSchema.safeParse(req.body)

        //convinient way to sending all the errors to the client
        if(!result.success) {
            const flatternErrors = result.error.flatten()
            console.log("FlatternErrors: ", flatternErrors)
            return res
            .status(400)
            .json({success: false, errors: flatternErrors})
        }

        const {text} = result.data
        const userId = req.userId

        const prompt = `
        Anaylze the following text and return:
        1: The mood type (happy, sad, stressed, angry, neutral, etc.)
        2: One short actionable advice for the user to improve or maintain their well-being.
        Text: "${text}"

        Response format(JSON only)
        {
            "moodType": "string",
            "advice": "string"
        }
        `;
        
        const response = await model.generateContent(prompt)
        const resText = response.response.text()
        let moodResult

        try {
            const cleanedText = resText.replace(/```json/g, "").replace(/```/g, "").trim()

            moodResult = JSON.parse(cleanedText) //coz what if the response is not in JSON type in that case we have parse into JSON explicitly
        } catch (e) {
            console.log(e)
            return res
            .status(500)
            .json({success: false, message: "Failed to parse AI response"})
        }

        const mood = await prisma.mood.create({
            data: {
                userId: userId!,
                text,
                moodType: moodResult.moodType || "unknown"
            }
        })

        return res.status(201).json({
            success: true,
            mood: moodResult.moodType,
            advice: moodResult.advice,
            saved: mood,
            message: "Mood status saved successfully"
        })

    } catch (e) {
        console.log("Error: ", e)
        return res.status(500).json({success: false, message: "Something went wrong while saving your mood status", error: e instanceof Error ? e.message : e})
        
    }
})

export default router