import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function Dashboard  ({ handleSignIn }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    username: "",
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
        navigate("/dashboard"); // This will navigate the user to the home page after successful login
      } else {
        alert(data.error || "Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login.");
    }
    setLoggedIn(!loggedIn);
  };

  const handleRegistration = () => {
    // Registration Logic
  };

  const data = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
  ];

  return (
    <div className="dashboard">
      {!loggedIn ? (
        <div>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                aria-required="true"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                aria-required="true"
              />
            </div>
            <button type="submit" >
              Sign In
            </button>
         
          <p>
            A new user? Register{" "}
            <a href="/registration" onClick={handleRegistration}>
              here
            </a>
            .
          </p>
          </form>
        </div>
      ) : (
        <div>
          <h2>Welcome to Dashboard</h2>
          <ul>
            <li>
              <a href="/trip-management">Trip Management</a>
            </li>
            <li>
              <a href="/ticket-sales">Ticket Sales</a>
            </li>
            <li>
              <a href="/customizable-reports">Reports</a>
            </li>
          </ul>
          <div className="chart-container">
            <h3>Sales Data</h3>
            <LineChart width={500} height={300} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Tooltip />
              <Legend />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
}
Dashboard.propTypes = {
  handleSignIn: PropTypes.func.isRequired,
};

export default Dashboard;
