require('dotenv').config()
import express from "express"
import cors from 'cors';
import { connectDB } from "./db/db";
import { router as userRouter } from "./routes/user.route";
import { router as accountRouter } from "./routes/account.route"
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

connectDB()

app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)


app.listen(port, () => {
    console.log(`App is running on port ${port}`)
})
