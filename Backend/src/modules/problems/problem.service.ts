import { db } from "../../prisma/db.js";

export async function getProblems() {
  return db.orm.public.Problem
    .select(
      "id",
      "title",
      "slug",
      "difficulty",
      "description",
      "createdAt",
    )
    .orderBy((problem) => problem.createdAt.desc())
    .all();
}

export async function getProblemBySlug(slug: string) {
  return db.orm.public.Problem.first({ slug });
}