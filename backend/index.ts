import express from "express"
import authRoutes from "./routes/auth"
import moodRoutes from "./routes/moodSts"
import getYourMoodStatuses from "./routes/getMoodSts"

const app = express()

app.get("/", (req:any, res:any) => {
    res.send("Hello from app")
})

app.use(express.json());
app.use(express.urlencoded({extended: true}))

//routes
app.use("/auth", authRoutes)
app.use("/moodSts", moodRoutes)
app.use("/getMoodSts", getYourMoodStatuses)

app.listen(8000, () => {
    console.log("Server is running on port 8000")
})




