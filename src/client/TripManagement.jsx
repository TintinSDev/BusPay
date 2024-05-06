import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';


// import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

const TripManagement = ({  onAddTrip, onUpdateTrip, onDeleteTrip }) => {
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [route, setRoute] = useState('');
  const [busIdentifier, setBusIdentifier] = useState('');
  // const [mapType, setMapType] = useState('roadmap'); 
  const [ trips, setTrips] = useState([]); // Initialize trips as an empty array
  
  
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/trips');
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch trips');
      }

      setTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Failed to fetch trips. Contact Support.');
    }
  };

  //  Adding trips
  const handleAddTrip = async () => {
    if (!departureTime.trim() || !arrivalTime.trim() || !route.trim() || !busIdentifier.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          departureTime,
          arrivalTime,
          route,
          busIdentifier,
        }),
      });
      const data = await response.json();
     

      if (!response.ok) {
        throw new Error('Failed to add trip');
      }
      setTrips((prevTrips) => [...prevTrips, data]);
      onAddTrip(data);
      clearForm();
      alert('Trip added successfully');
    } catch (error) {
      console.error('Error adding trip:', error);
      alert('Error adding trip. Please try again. If the issue persists, please contact support to add trip');
    }
  };

  const handleUpdateTrip = async (tripId) => {
    try {
      const tripToUpdate = trips.find((trip) => trip.id === tripId);
      const updatedTripData = {
        departure_time: departureTime || tripToUpdate.departure_time,
        arrival_time: arrivalTime || tripToUpdate.arrival_time,
        route: route || tripToUpdate.route,
        bus_identifier: busIdentifier || tripToUpdate.bus_identifier,
      };
  
      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTripData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update trip');
      }
  
      const updatedTrip = await response.json();
  
      setTrips((prevTrips) =>
        prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip))
      );
      onUpdateTrip(updatedTrip);
      alert('Trip updated successfully');
    } catch (error) {
      console.error('Error updating trip:', error);
      alert('Failed to update trip. Contact Support');
    }
  };
  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: 'DELETE',
      });
      console.log('Server response:', response);
  
      if (!response.ok) {
        throw new Error('Failed to delete trip. Please try again later.');
      }
  
      const data = await response.json();
  
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
      onDeleteTrip(data);
     
   
      alert('Trip deleted successfully');
    } catch (error) {
      console.error('Error deleting trip:', error);
      // Provide more informative error messages to users
      alert('Failed to delete trip. COntact Support.');
    }
  };
  
  const clearForm = () => {
    setDepartureTime('');
    setArrivalTime('');
    setRoute('');
    setBusIdentifier('');
  };
  // const handleChange = (e) => {
  //   setMapType(e.target.value);
  // };

  return (
    <div>
      <h2>Trip Management</h2>
      <div>
        <h3>Add Trip</h3>
        <label htmlFor="departureTime">Departure Time</label> <br />
        <input type="datetime-local" placeholder="Departure Time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} /> <br />
        <label htmlFor="arrivalTime">Arrival Time</label> <br />
        <input type="datetime-local" placeholder="Arrival Time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} /> <br />
        <br />
             {/* Dropdown for selecting route */}
             <label htmlFor="route">Route</label> <br /> 
        <select value={route} onChange={(e) => setRoute(e.target.value)}>
          <option value="">Select Route</option> 
          {/* Populate options dynamically */}
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={`Route ${i + 1}`}>Route {i + 1}</option>
          ))}
        </select> <br /> <br />
        {/* Dropdown for selecting bus identifier */}
        <label htmlFor="busIdentifier">Bus Identifier</label> <br />
        <select value={busIdentifier} onChange={(e) => setBusIdentifier(e.target.value)}>
          <option value="">Select Bus Identifier</option> <br />
          {/* Populate options dynamically */}
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={`Bus ${i + 1}`}>Bus {i + 1}</option>
          ))}
        </select> 
        <br /> <br />
        <button onClick={handleAddTrip}>Add Trip</button>
      </div>
      <div>
  <h3>Trips</h3>
  {trips && trips.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Departure Time</th>
          <th>Arrival Time</th>
          <th>Route</th>
          <th>Bus Identifier</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((trip) => (
          <tr key={trip.id}>
            <td>{trip.departure_time}</td>
            <td>{trip.arrival_time}</td>
            <td>{trip.route}</td>
            <td>{trip.bus_identifier}</td>
            <td>
              <button onClick={() => handleUpdateTrip(trip.id)}>Update</button>
              <button onClick={() => handleDeleteTrip(trip.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No trips available</p>
  )}
</div>
    </div>
  );
};

TripManagement.propTypes = {
  
  onAddTrip: PropTypes.func.isRequired,
  onUpdateTrip: PropTypes.func.isRequired,
  onDeleteTrip: PropTypes.func.isRequired,
};

export default TripManagement;