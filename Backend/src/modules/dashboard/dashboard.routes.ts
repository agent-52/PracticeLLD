import { Router } from "express";
import { getDashboard } from "./dashboard.service";

const dashboardRouter = Router();

dashboardRouter.get(
  "/dashboard",
  async (req, res) => {
    try {
      const dashboard = await getDashboard(
        req.sessionId,
      );

      res.json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      console.error(
        "GET /api/dashboard failed:",
        error,
      );

      res.status(500).json({
        success: false,
        error: {
          code: "DASHBOARD_FETCH_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Failed to fetch dashboard",
        },
      });
    }
  },
);

export default dashboardRouter;