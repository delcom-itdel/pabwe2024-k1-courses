import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="login-register-container welcome-page">
      <div className="welcome-left-section">
        <h2>Welcome to Courses Web</h2>
        <img src="src\pages\home.jpg" alt="Welcome Illustration" />
        <Link to="/login">
          <button className="btn primary">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn secondary">Register</button>
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
