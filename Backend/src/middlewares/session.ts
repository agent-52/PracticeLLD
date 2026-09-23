import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

export function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const sessionId = req.cookies?.lld_session ?? randomUUID();

  req.sessionId = sessionId;

  if (!req.cookies?.lld_session) {
    res.cookie("lld_session", sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  next();
}