import express from "express";
import cors from "cors";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { problemRouter } from "./modules/problems/problem.routes.js";
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middlewares/session.js";
import attemptRouter from "./modules/attempts/attempt.routes.js";
import submissionRouter from "./modules/submissions/submission.routes.js";
import evaluationRouter from "./modules/evaluations/evaluation.routes.js";


export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "LLD Practice API",
    },
  });
});

app.use("/api", sessionMiddleware, attemptRouter);
app.use("/api", sessionMiddleware, submissionRouter);
app.use("/api", sessionMiddleware, evaluationRouter);

app.use("/api/problems", problemRouter);

app.use(notFoundHandler);
app.use(errorHandler);



app.listen(env.port, () => {
    console.log(`server running on port ${env.port}`)
})