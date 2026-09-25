import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "./Pages/DashboardPage";
import ProblemDetailPage from "./Pages/ProblemDetailPage";
import PracticePage from "./Pages/PracticePage";
import FeedbackPage from "./Pages/FeedbackPage";

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
          path="/problems/:slug/attempts/:attemptId/practice"
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
