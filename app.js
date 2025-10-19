import express from "express";
import dotenv from "dotenv"
import { dbConnection } from "./db/db.js";
import cors from "cors"
import authRouter from "./routes/auth.js"
import reportRouter from "./routes/report.js"
const app = express()
dotenv.config()
app.get("/", (req, res) => res.send("Hello Dear , Server is Running!"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//routes
app.use("/api/auth", authRouter)
app.use("/api/report", reportRouter)

try {
  await dbConnection();
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed", err.messages);
}
console.log("after DB connection")
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))
}

// Vercel deployment
export default app