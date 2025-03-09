require('dotenv').config()
import express, { Request, Response } from "express"
const app = express();

const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
    res.send("Paytm project")
})


app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})