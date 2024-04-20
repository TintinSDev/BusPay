import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Registration({ handleRegister }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "", // Add a role field
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful");
        handleRegister(); // Call the handleRegister function passed as a prop
        navigate("/login"); // Redirect to the login page after successful registration
      } else {
        alert(data.error || "An error occurred during registration");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    }
  };

  return (
    <div className="wrapper">
      <form id="registration-form" onSubmit={handleSubmit}>
        <ion-icon name="close"></ion-icon>
        <div>
          <h2>Registration</h2>
          <div className="reg-box">
            <input
              type="text"
              required
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <label>Username</label>
          </div>
          <div className="reg-box">
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label>Email</label>
          </div>
          <div className="reg-box">
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label>Password</label>
          </div>
          {/* Add a dropdown or radio button for selecting the role */}
          <div className="reg-box">
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="bus_operator">Bus Operator</option>
            </select>
            <label>Role</label>
          </div>
          <button type="submit" className="btn">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

Registration.propTypes = {
  handleRegister: PropTypes.func.isRequired,
};

export default Registration;