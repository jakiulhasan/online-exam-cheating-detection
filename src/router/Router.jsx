import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "../pages/Homepage/page/Home";
import MainLayout from "../Layouts/MainLayout";
import LoginRegister from "../pages/Auth/LoginRegister";
import StudentProfile from "../pages/Profile/StudentProfile";
import TeacherProfile from "../pages/Profile/TeacherProfile";
import ExamRoom from "../pages/Exam/ExamRoom";
import Feature from "../pages/Homepage/Ai/Feature";
import Spec from "../pages/Homepage/spec/Spec";

const Router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { path: "/", Component: Home },
      { path: "/ai-features", Component: Feature },
      { path: "/system-spec", Component: Spec },
      { path: "/auth", Component: LoginRegister },
      { path: "/profile/student", Component: StudentProfile },
      { path: "/profile/teacher", Component: TeacherProfile },
      { path: "/exam", Component: ExamRoom },
    ],
  },
]);

export default Router;
