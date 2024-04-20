import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FareCollection from './client/FareCollection';
import Login from './client/Login';
import Registration from './client/Registration';
import TripManagement from './client/TripManagement';
import CustomizableReports from './client/CustomizableReports';
import Dashboard from './client/Dashboard';
import Navbar from './client/Navbar';
import { AuthProvider } from './client/AuthContext';
import 'react-time-picker/dist/TimePicker.css';

import './styles.css';

const App = () => {
  const handlePayment = (paymentData) => {
    // Handle payment logic here
    console.log('Payment data:', paymentData);
  };

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div>
          <div className="flex mt-10 justify-center">
            <video
              autoPlay
              loop
              muted
              className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
            >
              Your browser does not support the video tag.
            </video>
            <video
              autoPlay
              loop
              muted
              className="rounded-lg w-1/2 border border-orange-700 shadow-sm shadow-orange-400 mx-2 my-4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <Routes>
            <Route path="/mobile-payment" element={<FareCollection onPayment={handlePayment} />} />
            <Route path="/trip-management" element={<TripManagement />} />
            <Route path="/fare-collection" element={<FareCollection />} />
            <Route path="/customizable-reports" element={<CustomizableReports />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;