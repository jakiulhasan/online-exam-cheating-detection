import { createBrowserRouter, Navigate } from "react-router";
import MainLayout from "../Layouts/MainLayout";
import Landing from "../pages/Homepage/page/Landing";
import Feature from "../pages/Homepage/Ai/Feature";
import Spec from "../pages/Homepage/spec/Spec";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import CompleteProfile from "../pages/Auth/CompleteProfile";
import StudentProfile from "../pages/Profile/StudentProfile";
import TeacherProfile from "../pages/Profile/TeacherProfile";
import ExamRoom from "../pages/Exam/ExamRoom";
import ProctoredExam from "../pages/Exam/ProctoredExam";
import NotFound from "../pages/Error/NotFound";
import PrivateRoute from "../routes/PrivateRoute";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Landing },
      // Standalone sections kept as aliases (Navbar now links to /#features etc.)
      { path: "ai-features", Component: Feature },
      { path: "system-spec", Component: Spec },
      {
        path: "profile/complete",
        element: (
          <PrivateRoute>
            <CompleteProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "profile/student",
        element: (
          <PrivateRoute role="student">
            <StudentProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "profile/teacher",
        element: (
          <PrivateRoute role="teacher">
            <TeacherProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "exam",
        element: (
          <PrivateRoute>
            <ExamRoom />
          </PrivateRoute>
        ),
      },
    ],
  },

  // Auth (standalone, no navbar/footer)
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/forgot-password", Component: ForgotPassword },
  // Backward-compat for the old combined route
  { path: "/auth", element: <Navigate to="/register" replace /> },

  // Proctored exam — locked-down full-screen surface, no navbar
  {
    path: "/exam/:roomId/take",
    element: (
      <PrivateRoute>
        <ProctoredExam />
      </PrivateRoute>
    ),
  },

  { path: "*", Component: NotFound },
]);

export default Router;
