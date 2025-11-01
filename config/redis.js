import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect({
  host: "127.0.0.1",
  port: 6379,
});

redisClient.on("connect", () => console.log("Redis connected"));

export default redisClient;
