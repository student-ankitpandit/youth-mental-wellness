import express, { Router } from "express"
import z, { success } from "zod"
import prisma from "../lib/prisma"

const router = Router()

router.post("/moodStatus", async (req, res) => {
    try {
        const moodSchema = z.object({
            userId: z.string(),
            text: z.string().min(3, "Please describe your day")
        })

        const result = moodSchema.safeParse(req.body)

        if(!result.success) {
            const flatternErrors = result.error.flatten()
            console.log("FlatternErrors: ", flatternErrors)
            return res
            .status(400)
            .json({success: false, errors: flatternErrors})
        }

        const {userId, text} = result.data

        let moodType = "neutral"

        if(text.toLowerCase().includes("happy")) moodType = "happy"
        else if (text.toLowerCase().includes("sad")) moodType = "sad";
        else if (text.toLowerCase().includes("stress")) moodType = "stressed";

        const userMood = await prisma.mood.create({
            data: {
                user: {connect: {id: userId}},
                text,
                moodType
            }
        })

        return res
            .status(201)
            .json({success: true, message: "Mood status saved successfully", mood: userMood})
    } catch (e) {
        console.log("Error: ", e)
        return res.status(500).json({success: false, message: "Something went wrong while saving your mood status", error: e instanceof Error ? e.message : e})
        
    }
})

export default router