import { useState } from 'react';
import TimePicker from 'react-time-picker';
import PropTypes from 'prop-types';
// import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

const TripManagement = ({ trips, onAddTrip, onUpdateTrip, onDeleteTrip }) => {
//   const { user, isLoading } = useAuth();
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [route, setRoute] = useState('');
  const [busIdentifier, setBusIdentifier] = useState('');

  // Check if the user is a bus operator or an admin
//   const isBusOperatorOrAdmin = user && (user.role === 'bus_operator' || user.role === 'admin');

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isBusOperatorOrAdmin) {
//     return <div>You do not have permission to access this page.</div>;
//   }

  const handleAddTrip = async () => {
    // Validate form fields
    if (!departureTime.trim() || !arrivalTime.trim() || !route.trim() || !busIdentifier.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      // Send trip data to backend
      const response = await fetch('http://127.0.0.1:5000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Include the user's authentication token
        },
        body: JSON.stringify({
          departureTime,
          arrivalTime,
          route,
          busIdentifier,
        }),
      });

    //   if (!response.ok) {
    //     throw new Error('Failed to add trip');
    //   }

      // Call onAddTrip function passed from parent component
      onAddTrip({ departureTime, arrivalTime, route, busIdentifier });
    } catch (error) {
      console.error('Error adding trip:', error);
      alert('Failed to add trip');
    }
  };

  const handleUpdateTrip = async (tripId) => {
    try {
      // Send updated trip data to backend
      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Include the user's authentication token
        },
        body: JSON.stringify({
          departureTime,
          arrivalTime,
          route,
          busIdentifier,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update trip');
      }

      // Call onUpdateTrip function passed from parent component
      onUpdateTrip(tripId);
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip');
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      // Send request to delete trip to backend
      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}` // Include the user's authentication token
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete trip');
      }

      // Call onDeleteTrip function passed from parent component
      onDeleteTrip(tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip');
    }
  };
  const handleDepartureTimeChange = (time) => {
    setDepartureTime(time);
  };
  const handleArrivalTimeChange = (time) => {
    setArrivalTime(time);
  };

  return (
    <div>
      <h2>Trip Management</h2>
      <div>
        <h3>Add Trip</h3>
        <TimePicker
        value={departureTime}
        onChange={handleDepartureTimeChange}
        placeholder="Departure Time"
      />
      {/* Use a time picker component for arrival time */}
      <TimePicker
        value={arrivalTime}
        onChange={handleArrivalTimeChange}
        placeholder="Arrival Time"
      />
        <input type="text" placeholder="Route" value={route} onChange={(e) => setRoute(e.target.value)} />
        <input type="text" placeholder="Bus Identifier" value={busIdentifier} onChange={(e) => setBusIdentifier(e.target.value)} />
        <button onClick={handleAddTrip}>Add Trip</button>
      </div>
      <div>
        <h3>Trips</h3>
        {trips ? (
          <ul>
            {trips.map((trip, index) => (
              <li key={index}>
                Departure Time: {trip.departureTime}, Arrival Time: {trip.arrivalTime}, Route: {trip.route}, Bus Identifier: {trip.busIdentifier}
                <button onClick={() => handleUpdateTrip(index)}>Update</button>
                <button onClick={() => handleDeleteTrip(index)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No trips available</p>
        )}
      </div>
    </div>
  );
};

TripManagement.propTypes = {
  trips: PropTypes.array.isRequired,
  onAddTrip: PropTypes.func.isRequired,
  onUpdateTrip: PropTypes.func.isRequired,
  onDeleteTrip: PropTypes.func.isRequired,
};

export default TripManagement;