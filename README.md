# LLD Practice Platform

A simple full-stack platform for practicing Low-Level Design (LLD) problems.

Users can select an LLD problem, create an attempt, write their solution, save it as a draft, submit it, and get AI-based feedback.

## Features

- Browse LLD problems
- View problem requirements and constraints
- Create and manage practice attempts
- Save solutions as drafts
- Submit solutions
- AI-based solution evaluation
- Score and feedback
- View previous attempts
- Practice activity dashboard
- Anonymous session support

## Problems

The MVP includes:

- Parking Lot
- Vending Machine
- Elevator System

## Tech Stack

**Frontend**

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios

**Backend**

- Node.js
- Express.js
- TypeScript
- Prisma
- PostgreSQL

**AI**

- Groq API
- `openai/gpt-oss-120b`

**Deployment**

- Vercel
- Render
- PostgreSQL

## Architecture

The project uses a simple monolithic architecture.

```text
Frontend
   |
   v
Express API
   |
   v
Services
   |
   v
PostgreSQL

AI Evaluation
   |
   v
Groq API
```

The main database flow is:

Problem
|
Attempt
|
Submission
|
Evaluation

## Main API Routes

GET /api/problems
GET /api/problems/:slug

POST /api/problems/:problemId/attempts
GET /api/problems/:problemId/attempts

GET /api/attempts/:attemptId
GET /api/attempts/:attemptId/details
POST /api/attempts/:attemptId/submit

POST /api/attempts/:attemptId/evaluation
GET /api/attempts/:attemptId/evaluation
POST /api/attempts/:attemptId/evaluation/retry

## AI Evaluation

After submission, the solution is evaluated using the problem requirements and the submitted solution.

The evaluation considers areas such as:

Requirement understanding
Encapsulation
Abstraction
Interfaces
Coupling and cohesion
Extensibility
Overall design

The evaluation result contains a score and structured feedback.

## Local Setup

Backend
cd Backend
npm install
npm run dev

Backend environment variables:

DATABASE_URL=your_postgresql_url
EVALUATOR_TYPE=ai
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
FRONTEND_URL=http://localhost:5173
Frontend
cd Frontend
npm install
npm run dev

Frontend environment variable:

VITE_API_URL=http://localhost:3000/api

## User Flow

Problems
↓
Problem Details
↓
Start Attempt
↓
Write Solution
↓
Save Draft / Submit
↓
AI Evaluation
↓
Feedback

## AI Usage

AI tools were used during development for planning, implementation support, debugging, and AI evaluation development.

Detailed AI usage is documented in AI_USAGE.md.

## Scope

This MVP focuses on the core LLD practice flow. Authentication, advanced analytics, more problems, and other advanced features can be added later.
