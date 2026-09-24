import { Routes, Route } from "react-router-dom";
import Landing from "./pages/public/Landing";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import Resources from "./pages/public/Resources";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";

import StudentDashboard from "./pages/student/StudentDashboard";
import PasswordAnalyser from "./pages/student/PasswordAnalyser";
import LearningModules from "./pages/student/LearningModules";
import LessonDetail from "./pages/student/LessonDetail";
import Quiz from "./pages/student/Quiz";
import QuizResults from "./pages/student/QuizResults";
import Progress from "./pages/student/Progress";
import Profile from "./pages/student/Profile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsManagement from "./pages/admin/StudentsManagement";
import ModulesManagement from "./pages/admin/ModulesManagement";
import QuizManagement from "./pages/admin/QuizManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/AdminSettings";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forbidden" element={<Forbidden />} />

      {/* Student area — the password analyser is reachable even before
          committing to the full learning flow, per the landing page CTA. */}
      <Route
        path="/app"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><StudentDashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/analyser"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><PasswordAnalyser /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/modules"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><LearningModules /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/modules/:id"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><LessonDetail /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/quizzes/:id"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><Quiz /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/quizzes/:id/results"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><QuizResults /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/progress"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><Progress /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/profile"
        element={
          <ProtectedRoute role="STUDENT">
            <AppLayout role="STUDENT"><Profile /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin area */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout role="ADMIN"><AdminDashboard /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout role="ADMIN"><StudentsManagement /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/modules"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout role="ADMIN"><ModulesManagement /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/quizzes"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout role="ADMIN"><QuizManagement /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout role="ADMIN"><Analytics /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute role="ADMIN">
            <AppLayout role="ADMIN"><AdminSettings /></AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
