import { Router, type Request, type Response } from "express";
import { getProblemBySlug, getProblems } from "./problem.service";

export const problemRouter = Router();

problemRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const problems = await getProblems();

    res.status(200).json({
      success: true,
      data: problems,
    });
  } catch {
    res.status(500).json({
      success: false,
      error: {
        code: "PROBLEMS_FETCH_FAILED",
        message: "Failed to fetch problems",
      },
    });
  }
});

problemRouter.get(
  "/:slug",
  async (req: Request, res: Response) => {
    const slug = typeof req.params.slug === "string" ? req.params.slug : undefined;

    if (!slug) {
      res.status(400).json({
        success: false,
        error: {
          code: "INVALID_SLUG",
          message: "Problem slug is required",
        },
      });
      return;
    }

    try {
      const problem = await getProblemBySlug(slug);

      if (!problem) {
        res.status(404).json({
          success: false,
          error: {
            code: "PROBLEM_NOT_FOUND",
            message: "Problem not found",
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: problem,
      });
    } catch {
      res.status(500).json({
        success: false,
        error: {
          code: "PROBLEM_FETCH_FAILED",
          message: "Failed to fetch problem",
        },
      });
    }
  },
);