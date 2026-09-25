import { db } from "../../prisma/db";

export async function getProblems() {
  return db.orm.public.Problem.all();
}

export async function getProblemBySlug(slug: string) {
  return db.orm.public.Problem.first({
    slug,
  });
}