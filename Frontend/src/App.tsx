import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "./Pages/DashboardPage";
import ProblemDetailPage from "./Pages/ProblemDetailPage";

function PracticePage() {
  return <div>Practice Workspace</div>;
}

function FeedbackPage() {
  return <div>Feedback</div>;
}

function AttemptHistoryPage() {
  return <div>Attempt History</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/problems/:slug" element={<ProblemDetailPage />} />

        <Route
          path="/attempts/:attemptId/practice"
          element={<PracticePage />}
        />

        <Route
          path="/attempts/:attemptId/feedback"
          element={<FeedbackPage />}
        />

        <Route path="/history" element={<AttemptHistoryPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
