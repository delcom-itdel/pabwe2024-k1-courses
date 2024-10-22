import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RegisterInput from "../components/RegisterInput";
import { asyncSetIsAuthRegister } from "../states/isAuthRegister/action";
import "../styles/RegisterPageBaru.css";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthRegister = false } = useSelector((states) => states);

  if (isAuthRegister) navigate("/");

  const onAuthRegister = ({ name, email, password }) => {
    dispatch(asyncSetIsAuthRegister({ name, email, password }));
  };

  return (
    <div className="register-page-baru-container">  {/* New container */}
      <div className="register-page-baru">
        <h2>Register</h2>    
<img src="src\pages\register.jpg" alt="Register Illustration" />

        <RegisterInput onAuthRegister={onAuthRegister} />
      </div>
    </div>
  );
}

export default RegisterPage;