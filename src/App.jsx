import { useEffect } from "react"; 
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { asyncPreloadProcess } from "./states/isPreload/action";
import { asyncUnsetAuthLogin } from "./states/authLogin/action";
import Loading from "./components/Loading";
import Navigation from "./components/Navigation";
import LoginPageBaru from "./pages/LoginPageBaru"; // Import halaman login yang baru
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage"; // Import halaman HomePage
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import CourseAddPage from "./pages/CourseAddPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import WelcomePage from "./pages/WelcomePage"; // Import WelcomePage

function App() {
  const { authLogin = null, isPreload = false } = useSelector(
    (states) => states
  );

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

  // Kondisi untuk halaman login saja
  if (location.pathname === "/login") {
    return (
      <div className="login-page-container">
        <Routes>
          <Route path="/login" element={<LoginPageBaru />} />
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
        <div className="w-300px mx-auto mt-5">
          <div className="card shadow-sm">
            {/* Kondisi untuk menyembunyikan DELTA jika halaman login */}
            {location.pathname !== "/login" && (
              <div className="text-center py-2">
                <h2>D E L T A</h2>
              </div>
            )}
            <Routes>
              {/* WelcomePage sebagai halaman default */}
              <Route
                path="/"
                element={
                  <WelcomePage
                    onLoginClick={() => navigate("/login")}
                    onRegisterClick={() => navigate("/register")}
                  />
                }
              />
              {/* Ganti halaman login dengan LoginPageBaru */}
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<HomePage />} /> {/* HomePage setelah login */}
            </Routes>
          </div>
        </div>
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
            <Route path="/*" element={<NotFoundPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/users/me" element={<ProfilePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/add" element={<CourseAddPage />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
