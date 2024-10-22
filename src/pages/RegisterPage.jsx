import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RegisterInput from "../components/RegisterInput";
import { asyncSetIsAuthRegister } from "../states/isAuthRegister/action";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthRegister = false } = useSelector((states) => states);

  if (isAuthRegister) navigate("/");

  const onAuthRegister = ({ name, email, password }) => {
    dispatch(asyncSetIsAuthRegister({ name, email, password }));
  };

  return (
    <div className="login-register-container register-page">
      <div className="login-grid">
        <div className="register-left-section">
          <h2>Welcome to Courses Web</h2>
          <img src="src\pages\home.jpg" alt="Welcome Illustration" />
        </div>
        <div className="register-right-section">
          <h2>Register</h2>
          <RegisterInput onAuthRegister={onAuthRegister} />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
