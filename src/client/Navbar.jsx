
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
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
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/registration">Registration</Link>
                </li>
               
            </ul>
        </nav>
    );
};

export default Navbar;