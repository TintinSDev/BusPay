import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Login({ handleSignIn }) {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Login Successful");

        // Redirect to the home page or any other desired page
        handleSignIn();
        navigate("/trip-management"); // This will navigate the user to the home page after successful login
      } else {
        alert(data.error || "Invalid email address or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="wrapper">
      <form id="login-form" onSubmit={handleSubmit}>
        <div className="login">
          <h2>Login</h2>
          <div className="input-box">
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label>Password</label>
          </div>
          <div className="login-forgot">
            <label>
              <input type="checkbox" />
              Remember Me!
            </label>
            <a href="#"> Forgot Password </a>
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
};

export default Login;
