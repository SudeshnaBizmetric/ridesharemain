import axios from "axios";
import { useRef, useState } from "react";
import Navbar from "../../Utils/HOC/Navbar";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import './BookARide.css'
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import { API_KEY } from "../../Utils/Constants/API_KEY";
import { IoPersonOutline } from "react-icons/io5";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import Swal from 'sweetalert2'
import Footer from "../../Utils/HOC/Footer";
type StopoverType = {
  text: string;
};

type StopoverFareType = {
  price: number;
};

interface Ride {
  id: number;
  pickup: string;
  destination: string;
  date: string;
  No_Of_Seats: number;
  stopovers: StopoverType[];
  time: string;
  Fare: number;
  StopOver_Fare: StopoverFareType[];
  Car_Number: string; 
  Car_Type: string;
  instant_booking: boolean;
}

interface BookRide{
    UserID:number
    RideID:number
    Seats_Booked:number
    booking_status:boolean
    seats_remaining:number
}
const BookARide = () => {
  const navigate =useNavigate()
  const [pickup, setPickup] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [noOfSeats, setNoOfSeats] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [,setbookeddetails]=useState<BookRide[]>([])
  
  let driverid=0
  const [DriverID,setDriverid]=useState(driverid)
  const [remainingseats, setRemainingSeats] = useState<number>(0); 
  const UserID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  let RideID = 0;
  const [rideid,setrideid]=useState(RideID)
  const [noridesfound,setnoridesfound]=useState(false);

  const pickupRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const handlePlaceChange = (
    autocompleteRef: React.RefObject<google.maps.places.Autocomplete | null>,
    setLocation: (value: string) => void
  ) => {
    if (!autocompleteRef.current) return; // Ensure autocomplete is available
    const place = autocompleteRef.current.getPlace();
    setLocation(place?.formatted_address || "");
  };
  const handleDateClick = () => {
    const inputElement = document.getElementById('date-input') as HTMLInputElement;
    inputElement?.showPicker();  
  };
  

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!pickup || !destination) {
      setError("Please provide valid search criteria.");
      return;
    }

    try {
      const formattedDate = date ? date.toISOString().split("T")[0] : "";
      const response = await axios.get("https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/search-rides", {
        params: { pickup, destination, date: formattedDate, no_of_seats: noOfSeats },
      });
      setRides(response.data)
      const foundRides = response.data.rides || [];
    if(foundRides.length===0){
      setnoridesfound(true)
    }
    if (foundRides.length > 0) {
      setRides(foundRides);
      
    } else {
      setError("No rides found.");
    }
      const firstRide = foundRides[0];
      RideID=foundRides[0].ride_id;
      console.log(foundRides[0].ride_id)
      console.log(RideID)
      driverid=firstRide.UserID;
      setDriverid(driverid)
      console.log("Driverid",DriverID)
      //seats_remaining=firstRide.No_Of_Seats
    
      console.log(foundRides[0].No_Of_Seats)
      setrideid(RideID)
      console.log("remainingseats",remainingseats)
      console.log("Rides data:", response.data);
      const availableRides = foundRides.filter((ride: { No_Of_Seats: number }) => ride.No_Of_Seats > 0);
        console.log("Available Rides:", availableRides);

        if (availableRides.length === 0) {
            setError("No rides found with available seats.");
            alert("No seats available for this ride.");
            setnoridesfound(true);
        } else {
            setRides(availableRides);
        }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while searching for rides.");
    }
  };
    
  console.log(token)


  const handleInstantBooking = async () => {
    if (!token) {
      alert("Please login to continue");
      navigate("/login"); 
      return; 
    }
  
    // Fetch the latest seat count before booking
    try {
      const response = await axios.get(`https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/ride/${rideid}`);
      const updatedSeats = response.data.Seats_Remaining;
  
      if (updatedSeats <= 0) {
        alert("No seats available");
        return;
      }
  
      if (updatedSeats < noOfSeats) {
        alert(`Only ${updatedSeats} seat(s) are available`);
        return;
      }
  
      // Proceed with booking
      const bookingResponse = await axios.post(
        "https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/bookings_instant",
        {
          UserID,
          RideID: rideid,
          Seats_Booked: noOfSeats,
          booking_status: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      Swal.fire({
        title: "Ride booked successfully!",
        icon: "success",
        draggable: true
      });
  
      setbookeddetails(bookingResponse.data);
      setRemainingSeats(updatedSeats - noOfSeats); // Update remaining seats locally
      console.log("Booking response:", bookingResponse.data);
  
    } catch (err: any) {
      console.error("Booking error:", err);
  
      if (err.response?.data?.detail === "You cannot book a ride that you have published.") {
        Swal.fire({
          title: "Error",
          text: "You cannot book a ride that you have published.",
          icon: "error",
        });
      } else {
        setError("Failed to book the ride.");
      }
    }
  };
  

 const handlerequestride = async () => {
    console.log("Sending UserID:", UserID, "RideID:", rideid);

    try {
        const response = await axios.post(
            "https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/requestrides",
            {
                UserID,
                RideID: rideid,
                Seats_Requested: noOfSeats,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        Swal.fire({
            title: "Ride requested successfully!",
            icon: "success",
            draggable: true
        });

        console.log(response);

    } catch (err: any) {
        console.error("Request Ride error:", err);
        if (err.response?.data?.detail === "You cannot request a ride that you have published.") {
            Swal.fire({
                title: "Error",
                text: "You cannot request a ride that you have published.",
                icon: "error",
            });
        } else {
            Swal.fire({
                title: "Error",
                text: "Failed to request ride.",
                icon: "error",
            });
        }
    }
};

  
  return (
    <>

      <Navbar />
      <div className="search-ride">
        <h2>Search for a Ride</h2>
        <form onSubmit={handleSearch}>
          <div className="form-content">
            <div>
            <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
      
      <div>
       
        <Autocomplete
          onLoad={(autocomplete) => {
            pickupRef.current = autocomplete;
          }}
          onPlaceChanged={() => handlePlaceChange(pickupRef, setPickup)}
        >
          <input
             className="pickup-input"
            type="text"
            placeholder="Enter pick-up location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
          />
        </Autocomplete>
      </div>
       </LoadScript>
            </div>
            <div>
            <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>

<div>
 
  <Autocomplete
    onLoad={(autocomplete) => {
      destinationRef.current = autocomplete;
    }}
    onPlaceChanged={() => handlePlaceChange(destinationRef, setDestination)}
  >
    <input
      className="destination-input"
      type="text"
      placeholder="Enter destination"
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
      required
    />
  </Autocomplete>
</div>

</LoadScript>
            </div>
            <div>
            <input
        type="date"
        id="date-input"
        className="date-input"
        value={date ? date.toISOString().split("T")[0] : ""}
        onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
        required
        min={new Date().toISOString().split("T")[0]}
        onClick={handleDateClick} 
      />
   
            </div>
            <div className="passenger-box" >
                    <IoPersonOutline className="icon" />
                    <label className="label">Passengers:</label>
                    {noOfSeats === 1 ?(
                   <button disabled className="icon-passenger ">
                   <CiCircleMinus />
                  </button>
                ):
                (
                  <button onClick={() => setNoOfSeats(noOfSeats- 1)} className="icon-passenger ">
                  <CiCircleMinus />
                </button>
                )}
                 {noOfSeats> 0 && <p className="seats">{noOfSeats}</p>}
                    {noOfSeats === 5 ?(
                   <button disabled className="icon-passenger ">
                   <CiCirclePlus />
                 </button>
                ):
                (
                  <button onClick={() => setNoOfSeats(noOfSeats + 1)} className="icon-passenger ">
                  <CiCirclePlus />
                </button>
                )}
                 
                
  {/* <input
    type="number"
    placeholder="Passengers (1-5)"
    className="passenger-input"
    value={noOfSeats}
    onChange={handleSeatChange}
    min="1"
    max="5"
    required
  /> */}
</div>
           
     
     
           
           
            <button type="submit" className="search-btn">Search</button>
          </div>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
       
          <div className="rides">
          {rides.length > 0 ? (
            rides.map((ride, index) => (
              <div key={index} className="ride-box">
                <h3>
                  {ride.pickup} <HiOutlineArrowSmRight /> {ride.destination}
                </h3>
                <p>Date: {ride.date}</p>
                <p>Seats Available: {ride.No_Of_Seats}</p>
                <p>Price: ₹{ride.Fare}</p>
                <p>
                  Vehicle: {ride.Car_Type} ({ride.Car_Number})
                </p>
                {ride.stopovers.length > 0 && (
                  <p>Stopovers: {ride.stopovers.map((s) => s.text).join(", ")}</p>
                )}
                {ride.stopovers.length > 0 && (
                  <p>Stopover Fare: ₹{ride.StopOver_Fare.map((fare) => fare.price).join(", ")}</p>
                )}
                <p>
                  Time:{" "}
                  {ride.time
                    }
                </p>

               

                {ride.instant_booking ? (
                  <button onClick={handleInstantBooking} className="booking-btn"
                  disabled={remainingseats === 0}>Instant Booking</button>
                ) : (
                  <button className="booking-btn" onClick={handlerequestride}>Request a Ride</button>
                )}
              </div>
            ))
          ) : (
            noridesfound ? (
              <p className="noride">There are no rides yet 
               {rides.length > 0 && rides[0].date} between these cities</p>
            ) : (
              null
            )
          )}
          
         
        </div>
      
      
      </div>
      <div className="rides">
          {rides.length > 0 ? (
            rides.map((ride, index) => (
              <div key={index} className="ride-box">
                <h3>
                  {ride.pickup} <HiOutlineArrowSmRight /> {ride.destination}
                </h3>
                <p>Date: {ride.date}</p>
                <p>Seats Available: {ride.No_Of_Seats}</p>
                <p>Price: ₹{ride.Fare}</p>
                <p>
                  Vehicle: {ride.Car_Type} ({ride.Car_Number})
                </p>
                {ride.stopovers.length > 0 && (
                  <p>Stopovers: {ride.stopovers.map((s) => s.text).join(", ")}</p>
                )}
                {ride.stopovers.length > 0 && (
                  <p>Stopover Fare: ₹{ride.StopOver_Fare.map((fare) => fare.price).join(", ")}</p>
                )}
                <p>
                  Time:{" "}
                  {ride.time
                    }
                </p>

               

                {ride.instant_booking ? (
                  <button onClick={handleInstantBooking} className="booking-btn"
                  disabled={remainingseats === 0}>Instant Booking</button>
                ) : (
                  <button className="booking-btn" onClick={handlerequestride}>Request a Ride</button>
                )}
              </div>
            ))
          ) : (
            noridesfound ? (
              <p className="noride">There are no rides yet 
               {rides.length > 0 && rides[0].date} between these cities</p>
            ) : (
              null
            )
          )}
          
          
        </div>
       
      <Footer />
    </>
  );
};

export default BookARide;
