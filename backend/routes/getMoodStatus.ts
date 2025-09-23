import express, { Router } from 'express';
import prisma from '../lib/prisma';


const router = Router()

router.get("/moodStatus/:userId", async (req, res) => {
    try {
        const {userId} = req.params

        // Fetch mood statuses from the database for the given userId

        const moods = await prisma.mood.findMany({
            where: {userId},
            orderBy: {createdAt: 'desc'}
        })

        return res.status(200).json({success: true, messgae: "Mood statsuses fetched successfully", moods})
    } catch (e) {
        console.log("Error: ", e)
        return res.status(500).json({success: false, message: "Could not fetch mood statuses", error: e instanceof Error ? e.message : e})
    }
})

export default router