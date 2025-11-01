import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests, please try again after 15 minutes",
});

export const ReportLimiter = async (req, res, next) => {
  try {
    console.log("Report Limiter hit");
    const requestCounts = {};
    const ip = req.ip;
    const now = Date.now();
    if (requestCounts[ip]) {
      requestCounts[ip] = { count: 1, lastRequest: now };
    } else {
      const timeSincelastRequest = now - requestCounts[ip].lastRequest;
      const timeLimit = 15 * 60 * 1000;
      if (timeSincelastRequest > timeLimit) {
        requestCounts[ip].count += 1;
      } else {
        requestCounts[ip] = { count: 1, lastRequest: now };
      }
    }

    const maxRequest = 5;
    if (requestCounts[ip].count > maxRequest) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }

    requestCounts[ip].lastRequest = now;
    console.log("Report Limiter success");
    next();
  } catch (error) {
    console.log("error", error);
  }
};

export default limiter;
