import express from "express";
import dotenv from "dotenv"
import { dbConnection } from "./config/db.js";
import cors from "cors"
import authRouter from "./routes/auth.js"
import reportRouter from "./routes/report.js"
import familyRouter from "./routes/familyMember.js"
import nodeCron from "node-cron";
import limiter from "./middlewares/rateLimitor.js";
const app = express()
dotenv.config()
app.get("/", (req, res) => res.send("Hello Dear , Server is Running!"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

//routes
// app.use(limiter)
app.use("/api/auth", authRouter)
app.use("/api/report", reportRouter)
app.use("/api/family", familyRouter)

try {
  await dbConnection();
  console.log("DB connected");
} catch (err) {
  console.error("DB connection failed", err.messages);
}
console.log("after DB connection")

// nodeCron.schedule("* * * * * *", async () => {
//   console.log("running a task second day");
// });



if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))
}

// Vercel deployment
export default app