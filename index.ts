import express from "express"

const app = express()

app.use(express.json())

app.get("/", (req:any, res:any) => {
    res.send("Hello from app")
})

const PORT = 8000

app.listen(PORT, () => {
    console.log("Server is running on port 3000")
})


