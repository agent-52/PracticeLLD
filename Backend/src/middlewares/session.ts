import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const existingSession = req.cookies?.lld_session;
  const sessionId = existingSession ?? randomUUID();

  console.log("SESSION DEBUG:", {
    existingSession,
    sessionId,
    path: req.path,
  });

  req.sessionId = sessionId;

  if (!existingSession) {
    res.cookie("lld_session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  next();
}