import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPageBaru.css";
import { asyncSetAuthLogin } from "../states/authLogin/action"; // Import action login

function LoginPageBaru() {
  const [email, setEmail] = useState("");  // Ganti "username" dengan "email" agar konsisten
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    if (email && password) {
      // Dispatch login action
      dispatch(asyncSetAuthLogin({ email, password }));
      
      // Arahkan ke halaman HomePage setelah login sukses
      navigate("/home");
    } else {
      alert("Please enter your email and password");
    }
  };

  return (
    <div className="login-page-baru-container">
      <div className="login-page-baru">
        <div className="login-form-section">
          <h2>Login</h2>
          <div className="login-image-section">
            <img
              src="public\assets\vendor\login.jpg"
              alt="Login Illustration"
              className="login-image-large"
            />
          </div>
          <div className="login-inputs">
            <div className="input-group">
              <i className="fas fa-user"></i>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}  // Ganti "username" dengan "email"
              />
            </div>
            <div className="input-group">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="btn primary" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPageBaru;
