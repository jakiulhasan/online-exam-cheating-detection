import Navbar from "../components/navbar/Navbar";
import { Outlet, useLocation } from "react-router";
import Footer from "../components/footer/Footer";

const MainLayout = () => {
  const { pathname } = useLocation();
  const isDashboard =
    pathname === "/profile/student" ||
    pathname === "/profile/teacher" ||
    pathname === "/profile/complete" ||
    pathname === "/exam";

  if (isDashboard) return <Outlet />;

  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
