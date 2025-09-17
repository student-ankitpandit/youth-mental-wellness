import express from "express"

const app = express()

app.get("/", (req:any, res:any) => {
    res.send("Hello from app")
})

app.use(express.json());



app.listen(8000, () => {
    console.log("Server is running on port 8000")
})




