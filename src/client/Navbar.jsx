import { Link } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import PropTypes from "prop-types";

const Navbar = ({ isLoggedIn, handleSignOut }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="Analytics">
            <Analytics />
          </Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/trip-management">Trip Management</Link>
        </li>
        <li>
          <Link to="/fare-collection">Fare Payments</Link>
        </li>
        <li>
          <Link to="/customizable-reports">Customizable Reports</Link>
        </li>
        <li>
          <Link to="/inta">INTA</Link>
        </li>
        {!isLoggedIn && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/registration">Registration</Link>
            </li>
          </>
        )}
        {isLoggedIn && (
          <li>
            <a href="#" onClick={handleSignOut}>
              Logout
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  handleSignOut: PropTypes.func.isRequired,
};

export default Navbar;