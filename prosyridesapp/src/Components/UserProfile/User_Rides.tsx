import { useEffect, useState } from "react";
import Navbar from "../../Utils/HOC/Navbar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { HiOutlineUserCircle } from "react-icons/hi2";
import "./User_rides.css";

interface User {
  Name: string;
  E_mail: string;
  Phone_number: string;
}

interface RideRequest {
  id: number;
  userId: number;
  seatsRequested: number;
  status: string;
  user?: User;
}

interface Ride {
  id: number;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  Fare: number;
  carType: string;
  carNumber: string;
  No_Of_Seats: number;
  Rules_: string;
  requests: RideRequest[];
}

const User_Rides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approve, setApprove] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const token = localStorage.getItem("token");
  const UserID = localStorage.getItem("userID");

  const getRides = async () => {
    if (!UserID) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/v1/publishrides/${UserID}`);
      const ridesWithRequests = await Promise.all(
        response.data.map(async (ride: Ride) => {
          try {
            const requestResponse = await axios.get(
              `http://localhost:8000/v1/ride-requests/${ride.id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            const requestsWithUserInfo = Array.isArray(requestResponse.data)
              ? await Promise.all(
                  requestResponse.data.map(async (request: any) => {
                    try {
                      const userResponse = await axios.get(
                        `http://localhost:8000/v1/users/${request.UserID}`,
                        {
                          headers: { Authorization: `Bearer ${token}` },
                        }
                      );

                      return {
                        id: request.id,
                        userId: request.UserID,
                        seatsRequested: request.Seats_Requested,
                        status: request.status,
                        user: userResponse.data,
                      };
                    } catch (userError) {
                      console.error("Error fetching user data:", userError);
                      return null;
                    }
                  })
                )
              : [];

            return { ...ride, requests: requestsWithUserInfo.filter(Boolean) };
          } catch (requestError) {
            console.error(`Error fetching requests for ride ${ride.id}:`, requestError);
            return { ...ride, requests: [] };
          }
        })
      );

      setRides(ridesWithRequests);
      setLoading(false);
    } catch (err) {
      console.error("Error in getRides:", err);
      setError("Failed to fetch rides. Please try again.");
      setLoading(false);
    }
  };

  const handleInstantBooking = async (rideId: number, noOfSeats: number, userId: number) => {
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/bookings_instant",
        {
          UserID: userId,
          RideID: rideId,
          Seats_Booked: noOfSeats,
          booking_status: true,
          seats_remaining:  noOfSeats,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsBooked(true);
      localStorage.setItem("booking_status", "true");
      console.log("Booking response:", response.data);
      setApprove(true);
      getRides();
      setIsBooked(true);
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to book the ride.");
    }
  };

  const handleDeleteRide = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8000/v1/deleteride/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            Swal.fire("Deleted!", "Your ride has been deleted.", "success");
            getRides(); // Refresh the ride list
          })
          .catch((error) => {
            console.error("Error deleting ride:", error);
            Swal.fire("Error!", "Failed to delete the ride. Please try again.", "error");
          });
      }
    });
  };

  useEffect(() => {
    const posted = localStorage.getItem("booking_status") === "true";
    setIsBooked(posted);
    getRides();
  }, [approve]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="rides-container">
        {rides.map((ride) => (
          <div key={ride.id} className="user-ride-box">
            <p>
              {ride.pickup} --------{'>'} {ride.destination}
            </p>
            <p>
              {ride.date} <span id="space"></span> {ride.time}
            </p>
            <p>Fare: {ride.Fare} Rs.</p>
            <hr />
            {isBooked ? (
              ride.requests.map((request) => (
                <div key={request.id} className="userbooked">
                  <span className="icon">
                    <HiOutlineUserCircle />
                  </span>
                  <span id="space-small"></span>
                  <Link to={'bookeduser'}>
                    <p>{request.user?.Name}</p>
                  </Link>
                </div>
              ))
            ) : (
              ride.requests.map((request) => (
                <div key={request.id} className="user-ride-box">
                  <p>{request.user?.Name}</p>
                  <p>Seats Requested: {request.seatsRequested}</p>
                  <button
                    onClick={() => handleInstantBooking(ride.id, request.seatsRequested, request.userId)}
                    className="book-btn"
                  >
                    Approve
                  </button>
                </div>
              ))
            )}
            <hr />
            <button className="book-btn" onClick={() => handleDeleteRide(ride.id)}>
              Delete Ride
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default User_Rides;
