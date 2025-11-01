import redisClient from "../config/redis.js";

export const cache = async (req, res, next) => {
  try {
    console.log("cache hit");
    const key = req.url;
    console.log(key)
    const data = await redisClient.get(key);
    if (data) {
      console.log("data available");
      return res.status(200).json({
        data: JSON.parse(data),
        message: "Return from Cache.",
        status: true,
      });
    }
    console.log("data not available");
    next();
  } catch (error) {
    console.log("error", error);
  }
};
