import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type RubricCriterion = {
  label: string;
  weight: number;
};

export type Problem = {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  requirements: string[];
  constraints: string[];
  rubric: RubricCriterion[];
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function parseJsonString(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function normalizeStringArray(value: unknown): string[] {
  value = parseJsonString(value);

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === "string",
  );
}

function normalizeRubric(value: unknown): RubricCriterion[] {
  value = parseJsonString(value);

  /*
   * Format:
   *
   * [
   *   {
   *     label: "Class Responsibilities",
   *     weight: 20
   *   }
   * ]
   */
  if (Array.isArray(value)) {
    return value
      .map((item): RubricCriterion | null => {
        if (
          typeof item !== "object" ||
          item === null
        ) {
          return null;
        }

        const obj = item as Record<string, unknown>;

        const label =
          typeof obj.label === "string"
            ? obj.label
            : typeof obj.criterion === "string"
              ? obj.criterion
              : typeof obj.name === "string"
                ? obj.name
                : null;

        const rawWeight = obj.weight;

        const weight =
          typeof rawWeight === "number"
            ? rawWeight
            : typeof rawWeight === "string"
              ? Number.parseFloat(rawWeight)
              : NaN;

        if (!label || Number.isNaN(weight)) {
          return null;
        }

        return {
          label,
          weight,
        };
      })
      .filter(
        (item): item is RubricCriterion => item !== null,
      );
  }

  /*
   * Format:
   *
   * {
   *   criteria: [...]
   * }
   */
  if (
    typeof value === "object" &&
    value !== null &&
    "criteria" in value
  ) {
    return normalizeRubric(
      (value as { criteria: unknown }).criteria,
    );
  }

  /*
   * Format:
   *
   * {
   *   "Class Responsibilities": 20,
   *   "Encapsulation": 15
   * }
   */
  if (
    typeof value === "object" &&
    value !== null
  ) {
    const entries = Object.entries(value);

    const result: RubricCriterion[] = [];

    for (const [label, rawValue] of entries) {
      /*
       * {
       *   "Class Responsibilities": 20
       * }
       */
      if (typeof rawValue === "number") {
        result.push({
          label,
          weight: rawValue,
        });

        continue;
      }

      /*
       * {
       *   "Class Responsibilities": {
       *      "weight": 20
       *   }
       * }
       */
      if (
        typeof rawValue === "object" &&
        rawValue !== null &&
        "weight" in rawValue
      ) {
        const weightValue = (
          rawValue as { weight: unknown }
        ).weight;

        const weight =
          typeof weightValue === "number"
            ? weightValue
            : typeof weightValue === "string"
              ? Number.parseFloat(weightValue)
              : NaN;

        if (!Number.isNaN(weight)) {
          result.push({
            label,
            weight,
          });
        }
      }
    }

    return result;
  }

  return [];
}

function normalizeProblem(raw: unknown): Problem {
  if (
    typeof raw !== "object" ||
    raw === null
  ) {
    throw new Error("Invalid problem response");
  }

  const data = raw as Record<string, unknown>;

  return {
    id: String(data.id),
    title: String(data.title),
    slug: String(data.slug),
    difficulty:
      data.difficulty as "Easy" | "Medium" | "Hard",
    description: String(data.description),

    requirements: normalizeStringArray(
      data.requirements,
    ),

    constraints: normalizeStringArray(
      data.constraints,
    ),

    rubric: normalizeRubric(data.rubric),

    createdAt: String(data.createdAt),
  };
}

export async function getProblems(): Promise<Problem[]> {
  const response = await axios.get<ApiResponse<unknown[]>>(
    `${API_URL}/problems`,
    {
      withCredentials: true,
    },
  );

  return response.data.data.map(normalizeProblem);
}

export async function getProblem(
  slug: string,
): Promise<Problem> {
  const response = await axios.get<ApiResponse<unknown>>(
    `${API_URL}/problems/${slug}`,
    {
      withCredentials: true,
    },
  );

  return normalizeProblem(response.data.data);
}