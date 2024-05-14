import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// import { useAuth } from './AuthContext'; // Assuming you have an AuthContext

const TripManagement = ({ onAddTrip, onUpdateTrip, onDeleteTrip }) => {
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [fromRoute, setFromRoute] = useState("");
  const [toRoute, setToRoute] = useState("");
  const [busIdentifier, setBusIdentifier] = useState("");
  const navigate = useNavigate();
  // const [mapType, setMapType] = useState('roadmap');
  const [trips, setTrips] = useState([]); // Initialize trips as an empty array

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/trips");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }

      setTrips(data)
    } catch (error) {
      console.error("Error fetching trips:", error);
      alert("Failed to fetch trips. Contact Support.");
    }
  };

  //  Adding trips
  const handleAddTrip = async () => {
    if (
      !departureTime.trim() ||
      !arrivalTime.trim() ||
      !fromRoute.trim() ||
      !toRoute.trim() ||
      !busIdentifier.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departureTime,
          arrivalTime,
          fromRoute,
          toRoute,
          busIdentifier,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to add trip");
      }
      setTrips((prevTrips) => [...prevTrips, data]);
      onAddTrip(data);
      clearForm();
      alert("Trip added successfully");
    } catch (error) {
      console.error("Error adding trip:", error);
      alert(
        "Error adding trip. Please try again. If the issue persists, please contact support to add trip"
      );
    }
  };

  const handleUpdateTrip = async (tripId) => {
    try {
      const tripToUpdate = trips.find((trip) => trip.id === tripId);
      const updatedTripData = {
        departure_time: departureTime || tripToUpdate.departure_time,
        arrival_time: arrivalTime || tripToUpdate.arrival_time,
        from_route: fromRoute || tripToUpdate.from_route,
        to_route: toRoute || tripToUpdate.to_route,
        bus_identifier: busIdentifier || tripToUpdate.bus_identifier,
      };

      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTripData),
      });

      if (!response.ok) {
        throw new Error("Failed to update trip");
      }

      const updatedTrip = await response.json();

      setTrips((prevTrips) =>
        prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip))
      );
      onUpdateTrip(updatedTrip);
      alert("Trip updated successfully");
    } catch (error) {
      console.error("Error updating trip:", error);
      alert("Failed to update trip. Contact Support");
    }
  };
  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/trips/${tripId}`, {
        method: "DELETE",
      });
      console.log("Server response:", response);

      if (!response.ok) {
        throw new Error("Failed to delete trip. Please try again later.");
      }

      const data = await response.json();

      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
      onDeleteTrip(data);

      alert("Trip deleted successfully");
    } catch (error) {
      console.error("Error deleting trip:", error);
      // Provide more informative error messages to users
      alert("Failed to delete trip. COntact Support.");
    }
  };

  const clearForm = () => {
    setDepartureTime("");
    setArrivalTime("");
    setFromRoute("");
    setToRoute("");
    setBusIdentifier("");
  };
  const handlePayment = (e) => {
    e.preventDefault();
    navigate("/fare-collection");
  };

  return (
    <div>
      <h2>Trip Management</h2>
      <div>
        <h3>Add Trip</h3>
        <label htmlFor="departureTime">Departure Time</label> <br />
        <input
          type="datetime-local"
          placeholder="Departure Time"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
        />{" "}
        <br />
        <label htmlFor="arrivalTime">Arrival Time</label> <br />
        <input
          type="datetime-local"
          placeholder="Arrival Time"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
        />{" "}
        <br />
        <br />
        {/* Dropdown for selecting route */}
        <label htmlFor="fromRoute">From </label>
        <br />
        <select
          
          value={fromRoute}
          onChange={(e) => setFromRoute(e.target.value)}
        >
          <option value=""> Select From</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Malindi">Malindi</option>
          <option value="Nakuru">Nakuru</option>
          <option value="Kisumu">Kisumu</option>
          <option value="Eldoret">Eldoret</option>
          <option value="Machakos">Machakos</option>
          <option value="Kitale">Kitale</option>
          <option value="Kericho">Kericho</option>
          <option value="Nyeri">Nyeri</option>
        </select>
        <br />
        <br />
        <label htmlFor="toRoute">To</label>
        <br />
        <select
      
          value={toRoute}
          onChange={(e) => setToRoute(e.target.value)}
        >
          <option value="">Select To</option>
          <option value="Nairobi">Nairobi</option>
          <option value="Mombasa">Mombasa</option>
          <option value="Malindi">Malindi</option>
          <option value="Nakuru">Nakuru</option>
          <option value="Kisumu">Kisumu</option>
          <option value="Eldoret">Eldoret</option>
          <option value="Machakos">Machakos</option>
          <option value="Kitale">Kitale</option>
          <option value="Kericho">Kericho</option>
          <option value="Nyeri">Nyeri</option>
        </select>
        <br />
        <br />
        <label htmlFor="busIdentifier">Bus Identifier</label> <br />
        <select
          value={busIdentifier}
          onChange={(e) => setBusIdentifier(e.target.value)}
        >
          <option value="">Select Bus Identifier</option> <br />
          {/* Populate options dynamically */}
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={`Bus ${i + 1}`}>
              Bus {i + 1}
            </option>
          ))}
        </select>
        <br />
        <br /> <br />
        <button onClick={handleAddTrip}>Add Trip</button>
        <button onClick={handlePayment}>Proceed to payment</button>
      </div>
      <div>
        <h3>Trips</h3>
        {trips && trips.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Departure Time</th>
                <th>Arrival Time</th>
                <th>From </th>
                <th>To</th>
                <th>Bus Identifier</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.departure_time}</td>
                  <td>{trip.arrival_time}</td>
                  <td>{trip.from_route}</td>
                  <td>{trip.to_route}</td>
                  <td>{trip.bus_identifier}</td>
                  <td>
                    <button onClick={() => handleUpdateTrip(trip.id)}>
                      Update
                    </button>
                    <button onClick={() => handleDeleteTrip(trip.id)}>
                      Delete
                    </button>
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
