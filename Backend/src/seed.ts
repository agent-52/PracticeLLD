import "dotenv/config";
import { Temporal } from "@js-temporal/polyfill";

globalThis.Temporal = Temporal as unknown as typeof globalThis.Temporal;
import { db } from "./prisma/db.js";

const problems = [
  {
    title: "Parking Lot",
    slug: "parking-lot",
    difficulty: "MEDIUM",
    description:
      "Design a parking lot that supports multiple vehicle types, parking spots, and flexible allocation strategies.",
    requirements: [
      "The parking lot contains multiple floors.",
      "Different vehicle types may require different parking spots.",
      "Vehicles should be assigned to available spots.",
      "The parking allocation strategy should be replaceable.",
      "The design should support new vehicle or parking spot types.",
    ],
    constraints: [
      "One vehicle occupies one parking spot.",
      "A parking spot can hold only one vehicle.",
      "A vehicle must be assigned to a compatible spot.",
      "Pricing is outside the MVP scope.",
      "The learner may choose their own design approach.",
    ],
    rubric: {
      criteria: [
        {
          name: "Requirement Understanding",
          weight: 15,
        },
        {
          name: "Class Responsibilities",
          weight: 20,
        },
        {
          name: "Encapsulation",
          weight: 15,
        },
        {
          name: "Coupling & Cohesion",
          weight: 15,
        },
        {
          name: "Abstraction & Interfaces",
          weight: 15,
        },
        {
          name: "Extensibility",
          weight: 10,
        },
        {
          name: "Explanation Quality",
          weight: 10,
        },
      ],
    },
  },
  {
    title: "Vending Machine",
    slug: "vending-machine",
    difficulty: "EASY",
    description:
      "Design a vending machine that manages products, payments, inventory, and state transitions.",
    requirements: [
      "The machine stores multiple products.",
      "A user can select a product.",
      "The machine accepts payment and validates the amount.",
      "The machine dispenses the selected product when payment is sufficient.",
      "The machine should handle different operating states.",
    ],
    constraints: [
      "A product cannot be dispensed when out of stock.",
      "Insufficient payment should not dispense a product.",
      "The machine must return applicable change.",
      "Payment processing is limited to the MVP.",
    ],
    rubric: {
      criteria: [
        {
          name: "Requirement Understanding",
          weight: 15,
        },
        {
          name: "Class Responsibilities",
          weight: 20,
        },
        {
          name: "Encapsulation",
          weight: 15,
        },
        {
          name: "Coupling & Cohesion",
          weight: 15,
        },
        {
          name: "Abstraction & Interfaces",
          weight: 15,
        },
        {
          name: "Extensibility",
          weight: 10,
        },
        {
          name: "Explanation Quality",
          weight: 10,
        },
      ],
    },
  },
  {
    title: "Elevator",
    slug: "elevator",
    difficulty: "MEDIUM",
    description:
      "Design an elevator system that handles requests, multiple elevators, and changing system states.",
    requirements: [
      "The system supports multiple elevators.",
      "Users can request an elevator from a floor.",
      "Users can select a destination floor.",
      "The system should assign requests to suitable elevators.",
      "Elevator state should be represented explicitly.",
    ],
    constraints: [
      "An elevator can move between multiple floors.",
      "An elevator should not accept incompatible requests.",
      "The assignment strategy may change in the future.",
      "Advanced scheduling is outside the MVP.",
    ],
    rubric: {
      criteria: [
        {
          name: "Requirement Understanding",
          weight: 15,
        },
        {
          name: "Class Responsibilities",
          weight: 20,
        },
        {
          name: "Encapsulation",
          weight: 15,
        },
        {
          name: "Coupling & Cohesion",
          weight: 15,
        },
        {
          name: "Abstraction & Interfaces",
          weight: 15,
        },
        {
          name: "Extensibility",
          weight: 10,
        },
        {
          name: "Explanation Quality",
          weight: 10,
        },
      ],
    },
  },
] as const;

async function seed(): Promise<void> {
  for (const problem of problems) {
    const existing = await db.orm.public.Problem.first({
      slug: problem.slug,
    });

    if (existing) {
      continue;
    }

    await db.orm.public.Problem.create(problem);
  }

  console.log("Problems seeded successfully.");
  await db.runtime().close();
}

seed().catch(async (error: unknown) => {
  console.error("Seed failed:", error);
  await db.runtime().close();
  process.exitCode = 1;
});