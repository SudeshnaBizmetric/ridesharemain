import React, { memo, useEffect, useRef, useState } from "react";
import {
  LoadScript,
  Autocomplete,
} from "@react-google-maps/api";
import GoggleMapRoute from "./GoggleMapRoute";
import { API_KEY } from "../../Utils/Constants/API_KEY.ts";
import "./PublishRide.css";
import DistanceAndPrice from "./DistanceAndPrice";
import StopOvers from "./StopOvers";
import SetDate from "../../Utils/GlobalFunctions/SetDate";
import SetTime from "../../Utils/GlobalFunctions/SetTime";
import Navbar from "../../Utils/HOC/Navbar.tsx";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

//import axiosInstance from "../../Interceptors/axiosInstance.tsx";
type StopoverType = {
  text: string; 
};

type StopoverFareType = {
  price: number; 
};

interface StopOversProps {
  pickup: string;
  destination: string;
  stopovers: StopoverType[]; 
}

enum TimePeriod {
  am = "AM",
  pm = "PM",
}
const AutocompleteForm: React.FC<StopOversProps> = memo(() => {
  const navigate =useNavigate()
  const [pickup, setPickup] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [stopovers, setStopovers] = useState<StopoverType[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<{ hours: number | null; minutes: number | null; period: TimePeriod | null }>({
    hours: null,
    minutes: null,
    period: null,
  });
  const [isWomenOnly, setIsWomenOnly] = useState<boolean>(false);
  const [rules, setRules] = useState<string>("");
  const [fare, setFare] = useState<number>(0);
  const [stopOverFare, setStopOverFare] = useState<StopoverFareType[]>([]);
  //const [cancelRide, setCancelRide] = useState<boolean>(false);
  const [carNumber, setCarNumber] = useState<string>("");
  const [carType, setCarType] = useState<string>("");
  const [noOfSeats, setNoOfSeats] = useState<number>(1);
  const [instant_booking, setInstant_booking] = useState<boolean>(false);
  const [error, setError] = useState<{ [key: string]: string }>({});
  
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
  
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsWomenOnly(event.target.value === "yes");
  };
  
  const isAuthenticated = localStorage.getItem("token");
  const handleSubmit = async () => {
    const newError: { [key: string]: string } = {};
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  if (!regex.test(carNumber)) {
    newError.carNumber = "Invalid car number. Format: MH12AB1234.";
  }
    if (Object.keys(newError).length > 0) {
      setError(newError);
      return;
    }
    const token = localStorage.getItem('token');
  
    // Check if token exists in local storage
    if (!token) {
      console.error("User is not authenticated. Token is missing.");
      return;
    }
  
    // Decode the token and check expiration
    let UserID: number | undefined;
    
    try {
      const decodedToken = jwtDecode<{ id: number; exp: number }>(token);
      console.log("Decoded token:", decodedToken);
  
      // Check if the token has expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedToken.exp < currentTime) {
        console.error("Token has expired.");
        return;
      }
  
      // Set UserID from decoded token
      UserID = decodedToken.id;
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      return;
    }
  
    console.log("User ID from token:", UserID);
  
    // Check if UserID is available after decoding
    if (!UserID) {
      console.error("User ID is missing from the decoded token.");
      return;
    }
     if (!pickup || !destination || !date || !time || !carNumber || !carType || !noOfSeats) {
      alert("Please enter both pickup and destination locations.");
      return;
    }
    const formattedStopOverFare = stopOverFare.map(fare => ({ price: fare.price.toString() }));
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    // Prepare ride data to send in the request
    const rideData = {
      UserID,
      pickup: pickup,
      destination: destination,
      stopovers: stopovers,
      date: formattedDate,
      time: time ? `${time.hours}:${time.minutes} ${time.period}` : null,
      Is_women_only: isWomenOnly,
      Rules_: rules,
      Fare: parseInt(fare.toString()),
      StopOver_Fare: formattedStopOverFare,
      Car_Number: carNumber,
      Car_Type: carType,
      No_Of_Seats: noOfSeats,
      instant_booking: instant_booking,
      
    };
   
    // Make the POST request to the backend
    try {
      const response = await axios.post('http://127.0.0.1:8000/v1/publishrides', rideData,
        {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      } 
      );
      Swal.fire({
        title: "Ride Published successfully!",
        icon: "success",
        draggable: true
      });
      navigate("/your-rides")
      console.log('Ride published successfully:', response.data);
    } catch (error) {
      console.error('Error publishing ride:', error);
    }
  };
  

  const slides = [
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
      <div>
        <div>
          <label className="labels">Pick-up Location:</label>
          <Autocomplete
            onLoad={(autocomplete) => {
              pickupRef.current = autocomplete;
            }}
            onPlaceChanged={() => handlePlaceChange(pickupRef, setPickup)}
          >
            <input
              id="pickup"
              type="text"
              placeholder="Enter pick-up location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              required
            />
          </Autocomplete>
        </div>

        <div>
          <label className="labels">Destination:</label>
          <Autocomplete
            onLoad={(autocomplete) => {
              destinationRef.current = autocomplete;
            }}
            onPlaceChanged={() => handlePlaceChange(destinationRef, setDestination)}
          >
            <input
              id="destination"
              type="text"
              placeholder="Enter destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </Autocomplete>
        </div>
      </div>
    </LoadScript>,
    
    <DistanceAndPrice pickup={pickup} destination={destination} setValue={setFare} fare={fare}/>,
    <StopOvers pickup={pickup} destination={destination} setValue={setStopOverFare} setStp={setStopovers} stopOverFare={stopOverFare} stopovers={stopovers}/>,
    <SetDate setValue={setDate} date={date}/>,
    <SetTime setValue={setTime} time={time}/>,
     <div className="car-info">
      <div>
      <label className="labels">Car Model/type and Name :</label>
      <input type="text"  className="car-inputs" value={carType} onChange={(e)=>setCarType(e.target.value)}/>
      </div>
    <div>
    <label className="labels">Car Number :</label>
    <input type="text"  className="car-inputs" placeholder="e.g., MH12AB1234"  value={carNumber}  onChange={(e)=>setCarNumber(e.target.value)}/>
    

    </div>
    
    <label className="labels">Number of seats :</label>
     <div className="seat-flex">
             
     
              {noOfSeats === 1 ?(
                 <button disabled className="icons">
                 <CiCircleMinus />
                </button>
              ):
              (
                <button onClick={() => setNoOfSeats(noOfSeats- 1)} className="icons">
                <CiCircleMinus />
              </button>
              )}
              {noOfSeats> 0 && <p className="price">{noOfSeats}</p>}
              {noOfSeats === 5 ?(
                 <button disabled className="icons">
                 <CiCirclePlus />
               </button>
              ):
              (
                <button onClick={() => setNoOfSeats(noOfSeats + 1)} className="icons">
                <CiCirclePlus />
              </button>
              )}

              
             
            </div>

   </div>
   ,
   <div>
    <label>
        <input
            type="radio"
            id="instant-booking"
            onChange={(e) => setInstant_booking(e.target.checked)} // Use checked instead of value
        />
        Enable Instant booking?
    </label>
    <br></br>
    <br></br>
    <br></br>
    <label>
        <input type="radio" id="request-booking" />
        Review requests before booking?
    </label>
</div>

   ,

   
    <div className="last-page">
      <div>
      <label className="labels">Is women only?</label>
      <div>
        <input
          type="radio"
          name="womenOnly"
          value="yes"
          id="womenYes"
          className="woman-inputs"
          checked={isWomenOnly === true}
          onChange={handleRadioChange}
        />
        <label htmlFor="womenYes">Yes</label>
      </div>
      <div>
        <input
          type="radio"
          name="womenOnly"
          value="no"
          id="womenNo"
          className="woman-inputs"
          checked={isWomenOnly === false}
          onChange={handleRadioChange}
        />
        <label htmlFor="womenNo">No</label>
      </div>
    </div>
     

      <div>
        <label className="labels">Enter any additional information (Rules , flexible timings ,stops, <br></br>extra infromation on route,keep passengers in loop) </label>
        <div>
        <input type="text"  className="text" value={rules} onChange={(e)=>setRules(e.target.value)}/>
        </div>
        </div>
         <div>
               <button 
               className="next-btn"
               onClick={handleSubmit}
               >
               Publish Ride
               
             </button>
            
         </div>
         {error.carNumber && <p className="error-message">{error.carNumber}</p>}
      </div>
    ,
  ];

  

  const handleNext = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
   
  };

  const handleBack = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };
 
   useEffect(()=>{
    if(!isAuthenticated){
      navigate("/login");
    }
   },[isAuthenticated,navigate])

  return (
    <>
      <Navbar />
      <div className="main">
        <div className="left">
          <div className="carousel">
            {slides[currentSlide]}
            </div>
            <div className="button-section">
            <div className="carousel-controls">
              <button onClick={handleBack} disabled={currentSlide === 0} className="back-btn">
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                className="next-btn">
                Next
              </button>


             </div>
             
             
            </div>
            
            
        </div>
        <div className="right">
        <GoggleMapRoute pickup={pickup} destination={destination} />
        </div>
      </div>
    </>
  );
});

export default AutocompleteForm;
