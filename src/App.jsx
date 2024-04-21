import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FareCollection from './client/FareCollection';
import Login from './client/Login';
import Registration from './client/Registration';
import TripManagement from './client/TripManagement';
import CustomizableReports from './client/CustomizableReports';
import Dashboard from './client/Dashboard';
import Navbar from './client/Navbar';
import { AuthProvider } from './client/AuthContext';
import vid2 from './assets/vid2.mp4';
import 'react-time-picker/dist/TimePicker.css';
import MyScreen from './client/Inta';  

import './styles.css';

const App = () => {
  const handlePayment = (paymentData) => {
    // Handle payment logic here
    console.log('Payment data:', paymentData);
  };
  const handleAddTrip = (tripData) => {
    // Handle trip management logic here
    console.log('Trip data:', tripData);
  };
  const handleUpdateTrip = (tripData) => {
    // Handle trip management logic here
    console.log('Trip data:', tripData);
  };
  const handleDeleteTrip = (tripData) => {
    // Handle trip management logic here
    console.log('Trip data:', tripData);

  };
  const handleGenerateReport = (reportData) => {
    // Handle report generation logic here
    console.log('Report data:', reportData);
  };
  const handleExportReport = (reportData) => {
    // Handle report export logic here
    console.log('Report data:', reportData);
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
              <source src={vid2} type="video/mp4" />
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
            <Route path="/fare-collection" element={<FareCollection onPayment={handlePayment} />} />
            <Route path="/trip-management" element={<TripManagement onAddTrip = {handleAddTrip} onUpdateTrip = {handleUpdateTrip} onDeleteTrip = {handleDeleteTrip} />} />
           
            <Route path="/customizable-reports" element={<CustomizableReports onGenerateReport={handleGenerateReport}onExportReport={ handleExportReport} />} />
            <Route path="/login" element={<Login handleSignIn={() => {}} />} />
            <Route path="/registration" element={<Registration handleRegister={() => {}} />}/>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inta" element={<MyScreen />} />
            
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;