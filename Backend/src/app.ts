import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { problemRouter } from "./modules/problems/problem.routes.js";


export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "LLD Practice API",
    },
  });
});

app.use("/api/problems", problemRouter);

app.use(notFoundHandler);
app.use(errorHandler);



app.listen(env.port, () => {
    console.log(`server running on port ${env.port}`)
})