---

# `AI_USAGE.md`

```md
# AI Usage

AI tools were used during the development of this project.

The main purpose of using AI was to speed up development, understand problems, debug issues and improve the implementation.

## Where AI Was Used

### 1. Project Planning

AI was used to discuss:

- MVP scope
- Backend modules
- Database entities
- API flow
- Frontend screens
- Basic application architecture

The final implementation decisions were reviewed and adjusted during development.

### 2. Backend Development

AI was used for help with:

- Express route structure
- TypeScript types
- Service layer structure
- Prisma queries
- Session handling
- API response handling
- Error handling
- Debugging backend issues

The backend was tested manually and changes were adjusted when needed.

### 3. Frontend Development

AI was used for help with:

- React component structure
- API integration
- React Query hooks
- TypeScript types
- Loading and error states
- Navigation flow
- Form and submission handling

The UI was implemented according to the project design and then connected to the backend APIs.

### 4. AI Evaluation Feature

AI was also used as part of the actual product.

The application sends the following information to the evaluator:

- LLD problem
- Problem requirements
- Problem constraints
- Evaluation rubric
- User code
- User explanation
- User diagram, if available

The evaluator returns structured JSON containing:

- Overall score
- Summary
- Rubric-wise feedback
- Strengths
- Concerns
- Suggestions
- Individual criteria scores

The application validates the returned data before storing it.

### 5. Debugging

AI was used to help debug issues during development, including:

- TypeScript build errors
- Prisma issues
- Node.js ESM import issues
- CORS configuration
- Cookie/session handling
- Frontend production build issues
- Deployment issues

Logs and error messages were checked before making changes.

## What Was Not Done

AI was not used to blindly generate the complete project and submit it without testing.

The project was developed step by step. Generated suggestions were checked, changed when needed, and tested during development.

## AI Tools Used

The main AI tool used during development was:

- ChatGPT

The application itself uses:

- Groq API
- `openai/gpt-oss-120b` model

## Human Review

The final code, project flow and feature decisions were reviewed during development.

AI suggestions were treated as development help, not as a replacement for testing or engineering decisions.
```
