# AI Mock Interview Platform

AI Mock Interview Platform is a full-stack MERN-style SaaS MVP for resume-aware mock interviews, AI feedback, ATS scoring, progress analytics, certificate generation, and portfolio-ready interview reports. It is designed for final-year major projects, college demonstrations, internship showcases, and recruiter portfolio walkthroughs.

## Features

- JWT-based registration, login, logout, refresh sessions, forgot password, and reset password
- Demo-ready Google, LinkedIn, and phone login endpoints for final project walkthroughs
- Protected dashboard and interview workflows
- PDF resume upload with server-side file validation
- ATS resume fit scoring with keyword, section, impact, and role-alignment checks
- AI question generation with a local fallback when the AI provider is unavailable
- Guided interview session with answer persistence
- Voice interview support with question playback, microphone answers, and text fallback
- AI evaluation with deterministic local fallback scoring and saved interview history
- PDF scorecard export
- Certificate generator for completed interviews
- Searchable interview history with soft delete, bulk delete, restore, and undo
- Admin dashboard for platform metrics, user management, and report export
- Chart.js analytics dashboard with score trends, monthly progress, and skill growth
- Deep interview history view with questions, answers, feedback, strengths, weaknesses, and learning recommendations
- Recycle-bin history management with search, filter, sort, bulk delete, restore, undo, confirmation modal, and toast notifications
- Results redesign with score meter, score bars, badges, question-level feedback, PDF report export, and certificate export
- Light, dark, and system theme modes
- Responsive layouts for mobile, tablet, and desktop
- Security middleware: Helmet, CORS allowlist, rate limiting, upload size/type limits

## Tech Stack

**Frontend**
- React 19
- Vite
- React Router
- Axios
- Chart.js
- React Hot Toast
- React Icons
- jsPDF

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- pdf-parse
- Google Gemini API

## Folder Structure

```text
AI Mock Interview/
  client/
    public/
    src/
      components/
      pages/
      routes/
      services/
      index.css
      main.jsx
    package.json
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    server.js
    package.json
  postman/
  dashboard-report.md
  analytics-report.md
  feedback-system-report.md
  security-report.md
  performance-report.md
  test-report.md
  uiux-report.md
  README.md
```

## Architecture

```text
React + Vite Client
  -> Axios API services
  -> Protected React Router pages
  -> Results, history, dashboard, admin, and export UI

Express API Server
  -> Auth, resume, interview, evaluation, history, and admin routes
  -> Validation, sanitization, rate limiting, auth, and error middleware
  -> Gemini integration with deterministic fallback engines

MongoDB
  -> Users
  -> Interviews with enriched feedback and soft delete
  -> ATS reports for resume analytics
```

## Installation

Clone the repository:

```bash
git clone https://github.com/PavanRameshMalthi/AI-Mock-Interview.git
cd AI-Mock-Interview
```

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/ai_mock_interview
JWT_SECRET=replace-with-a-long-random-secret
GEMINI_API_KEY=replace-with-your-gemini-api-key
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit real `.env` files or API keys.

## Running The Project

Start MongoDB locally, then start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

## Build Instructions

Frontend production build:

```bash
cd client
npm run build
```

Backend production start:

```bash
cd server
npm start
```

## Testing Instructions

Run frontend tests with coverage:

```bash
cd client
npm test
```

Run backend API tests with coverage:

```bash
cd server
npm test
```

Current verified coverage:

- Frontend statements: 51.44%
- Backend statements: 65.58%

Run lint:

```bash
cd client
npm run lint
```

## API Documentation

Base URL:

```text
http://localhost:5000/api
```

### Auth

`POST /auth/register`

```json
{
  "name": "Alex Morgan",
  "email": "alex@example.com",
  "password": "Password123!"
}
```

`POST /auth/login`

```json
{
  "email": "alex@example.com",
  "password": "Password123!"
}
```

`POST /auth/refresh`

- Uses the secure refresh-token cookie to issue a new access token.
- The client route guard calls this automatically so sessions persist after refresh.

`POST /auth/logout`

- Protected route
- Clears the stored refresh token and cookie.

`POST /auth/forgot-password`

```json
{
  "email": "alex@example.com"
}
```

- In development, the response includes a reset token for easy local testing.

`POST /auth/reset-password`

```json
{
  "token": "password-reset-token",
  "password": "NewPassword123!"
}
```

`POST /auth/google`

```json
{
  "email": "alex@example.com",
  "name": "Alex Morgan",
  "googleId": "google-profile-id"
}
```

`POST /auth/linkedin`

```json
{
  "email": "alex@example.com",
  "name": "Alex Morgan",
  "linkedinId": "linkedin-profile-id",
  "headline": "Frontend Developer"
}
```

`POST /auth/phone`

```json
{
  "phone": "+919876543210",
  "otp": "123456",
  "name": "Alex Morgan"
}
```

Google and LinkedIn currently use trusted profile payloads suitable for demo/local submission builds. For production, connect these endpoints to real OAuth callbacks and provider token verification. Phone login uses `123456` as the development OTP and should be connected to an SMS OTP provider before production use.

`POST /auth/verify-email`

```json
{
  "token": "email-verification-token"
}
```

`POST /auth/resend-verification`

- Protected route
- Generates a new email verification token. In development, the token is returned in the response for local testing.

### Resume

`POST /resume/upload`

- Protected route
- Multipart form field: `resume`
- PDF only
- Max size: 5 MB
- Returns extracted text and a general ATS readiness score

`POST /resume/ats-score`

- Protected route
- Scores extracted resume text against a target role

```json
{
  "role": "Frontend Developer",
  "resumeText": "Skills React JavaScript CSS projects..."
}
```

Example response:

```json
{
  "success": true,
  "atsScore": {
    "score": 84,
    "level": "Strong",
    "matchedKeywords": ["react", "javascript"],
    "missingKeywords": ["accessibility"],
    "recommendations": ["Add relevant role keywords: accessibility."]
  }
}
```

### Interview

`POST /interview/generate`

- Protected route

```json
{
  "role": "Frontend Developer",
  "experience": "Entry level",
  "difficulty": "Beginner",
  "questionCount": 5,
  "resumeText": "Optional resume text"
}
```

When `resumeText` is provided, the response also includes `atsScore`.

### Evaluation

`POST /evaluation/evaluate`

- Protected route

```json
{
  "role": "Frontend Developer",
  "questions": ["Question 1"],
  "answers": ["Answer 1"],
  "resumeText": "Optional resume text"
}
```

The evaluation response includes technical, communication, problem-solving, overall, feedback, and optional ATS scoring. Interview history stores the final score and ATS snapshot.

### History

`GET /history`

- Protected route
- Returns the latest saved interview evaluations for the current user.
- Query parameters: `search`, `difficulty`, `status=active|deleted`, `sort=newest|oldest|score-high|score-low`.

`GET /history/analytics`

- Protected route
- Returns summary metrics, interview trends, ATS trends, weekly progress, monthly progress, role-based progress, skill growth, strong skill areas, and weak skill areas.

`GET /history/:interviewId`

- Protected route
- Returns a deep interview view with questions, answers, scores, feedback, ATS snapshot, and improvement tracker.

`DELETE /history/:interviewId`

- Soft deletes one interview from active history.

`PATCH /history/bulk-delete`

```json
{
  "interviewIds": ["507f1f77bcf86cd799439011"]
}
```

`PATCH /history/:interviewId/restore`

- Restores a soft-deleted interview.

### Admin

Admin routes require a JWT for a user with `role: "admin"`.

`GET /admin/summary`

- Returns total users, total interviews, ATS reports, active users, latest users, and recent interviews.

`GET /admin/export`

- Returns exportable JSON for recent interview and ATS reports.

`DELETE /admin/users/:userId`

- Deletes a user and related interview/ATS records.

## Screenshots

Recommended screenshots for the GitHub repository:

- Landing page
- Login, signup, forgot password, and reset password
- Dashboard
- Resume upload
- Interview setup
- Interview session
- Results page
- History and certificate pages

## Deployment Guide

Frontend deployment options:

- Vercel
- Netlify
- Render static site

Backend deployment options:

- Render
- Railway
- Fly.io
- Node-capable VPS

Production checklist:

- Use MongoDB Atlas or a managed MongoDB instance
- Set `FRONTEND_URL` to the deployed frontend URL
- Set `VITE_API_URL` to the deployed backend API URL
- Rotate and store secrets in the hosting provider's environment manager
- Enable HTTPS
- Configure CORS for production domains only
- Monitor server logs and API errors

## Docker

Build and run MongoDB plus the backend with Docker Compose:

```bash
docker compose up --build
```

The frontend Dockerfile builds a static bundle that can be served by Nginx:

```bash
cd client
docker build -t ai-mock-interview-client .
```

For production, provide real secrets through your environment manager instead of hardcoding values in `docker-compose.yml`.

## Future Enhancements

- Webcam mock interview recording
- Payment/subscription tiers
- Public certificate verification page
- Real Google OAuth token verification and LinkedIn OAuth callback handling
- SMS provider integration for production phone OTP delivery
- Advanced radar charts and cohort analytics
- Pagination for large interview history collections
- CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit focused changes
4. Run lint/build checks
5. Open a pull request with a clear summary

## License

This project is currently marked as ISC in the backend package metadata. Add a root `LICENSE` file before public production release.
