import { useEffect } from "react"; 
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { asyncPreloadProcess } from "./states/isPreload/action";
import { asyncUnsetAuthLogin } from "./states/authLogin/action";
import Loading from "./components/Loading";
import Navigation from "./components/Navigation";
import LoginPageBaru from "./pages/LoginPageBaru"; 
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import CourseAddPage from "./pages/CourseAddPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import WelcomePage from "./pages/WelcomePage";

function App() {
  const { authLogin = null, isPreload = false } = useSelector((states) => states);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  const onAuthSignOut = () => {
    dispatch(asyncUnsetAuthLogin());
  };

  if (isPreload) {
    return null;
  }

  // Kondisi khusus untuk halaman login dan register saja
  if (location.pathname === "/login" || location.pathname === "/register") {
    return (
      <div className="auth-page-container">  {/* Ubah container untuk halaman login & register */}
        <Routes>
          <Route path="/login" element={<LoginPageBaru />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    );
  }

  // Jika belum login, tampilkan halaman WelcomePage
  if (authLogin === null) {
    return (
      <div>
        <header className="fixed-top">
          <Loading />
        </header>
        {/* Hilangkan w-300px mx-auto mt-5 dan card shadow-sm untuk WelcomePage */}
        <Routes>
          <Route
            path="/"
            element={
              <WelcomePage
                onLoginClick={() => navigate("/login")}
                onRegisterClick={() => navigate("/register")}
              />
            }
          />
        </Routes>
      </div>
    );
  }

  // Jika sudah login, tampilkan halaman sesuai dengan status login
  return (
    <>
      <div>
        <header className="fixed-top">
          <Navigation authLogin={authLogin} onAuthSignOut={onAuthSignOut} />
          <Loading />
        </header>
        <main className="margin-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/users/me" element={<ProfilePage />} />
            <Route path="/courses/add" element={<CourseAddPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
