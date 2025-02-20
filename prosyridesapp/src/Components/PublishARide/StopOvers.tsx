import { useEffect, useRef, useState } from "react";
import { API_KEY } from "../../Utils/Constants/API_KEY";
import { Autocomplete, LoadScript } from "@react-google-maps/api";
import "../../Utils/GlobalCSS/button.css";
import "./PublishRide.css";
import { RxCross2 } from "react-icons/rx";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import React from "react";

type stopoversType = {
  text: string;
};
type StopoverFareType = {
  price: number;
};

const StopOvers: React.FC<{
  pickup: string;
  destination: string;
  setValue: React.Dispatch<React.SetStateAction<StopoverFareType[]>>;
  setStp: React.Dispatch<React.SetStateAction<stopoversType[]>>;
  stopOverFare: StopoverFareType[];
  stopovers: stopoversType[];
}> = ({
  pickup,
  destination,
  setValue,
  setStp,
  stopOverFare,
  stopovers,
}) => {
  const [stopoverDistance, setStopoverDistance] = useState<string[]>([]);
  const stopoversRef = useRef<Array<google.maps.places.Autocomplete | null>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStopoverPlaceChange = (index: number) => {
    const stopoverAutocomplete = stopoversRef.current[index];
    if (stopoverAutocomplete) {
      const place = stopoverAutocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const newStopovers = [...stopovers];
        newStopovers[index].text = `${place.name}`;
        setStp(newStopovers);
      } else {
        alert("No details available for stopover");
      }
    }
  };

  const addStopover = () => {
    setStp([...stopovers, { text: "" }]);
    stopoversRef.current.push(null); 
  };

  
  const getStopoverDistances = () => {
    if (stopovers.length === 0) {
      alert("Stopovers are missing!");
      return;
    }

    setLoading(true); 
    const stopoverAddresses = stopovers.map((stopover) => stopover.text);
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pickup],
        destinations: stopoverAddresses,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: any) => {
        setLoading(false); 
        if (status === google.maps.DistanceMatrixStatus.OK) {
          const distances = response.rows[0].elements.map((element: any) => {
            if (element.status === "OK") {
              return `${element.distance.text} (${element.duration.text})`;
            }
            return "Error"; 
          });
          setStopoverDistance(distances);
        } else {
          alert(`Error: ${status}`);
        }
      }
    );
  };

  useEffect(() => {
    if (stopoverDistance.length > 0) {
      const totalFare = stopoverDistance.map((dist) => {
        return {price:calculateFare(dist)}; 
      });

      setValue(totalFare);
    }
  }, [stopoverDistance, setValue]);

  const handleStopovers = (index: number, value: string) => {
    const newStopovers = [...stopovers];
    newStopovers[index].text = value;
    setStp(newStopovers);
  };

  

  const removeStopover = (stpIndex: number) => {
    setStp(stopovers.filter((_, i) => i !== stpIndex));
  };

  const calculateFare = (distanceString: string) => {
    const match = distanceString.match(/\d+(\.\d+)?/); // Extract numeric value (e.g., "10.5 km")
    if (match) {
      const distanceValue = parseFloat(match[0]);
      return distanceValue * 2; // Example fare calculation: distance * 2
    }
    return 0;
  };

  return (
    <>
      <div className="stopover-container-wrapper">
        <label className="labels">Add Stops to Increase Ride Opportunities</label>
        <div className="stopover-container">
          <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
            <div className="stopovers-list">
              {stopovers.map((stopover, index) => (
                <div key={index} className="stopover-item">
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      stopoversRef.current[index] = autocomplete;
                    }}
                    onPlaceChanged={() => handleStopoverPlaceChange(index)}
                  >
                    <input
                      id="stopovers"
                      type="text"
                      placeholder="Enter stopover"
                      value={stopover.text}
                      onChange={(e) => handleStopovers(index, e.target.value)}
                    />
                  </Autocomplete>
                  <button
                    onClick={() => removeStopover(index)}
                    className="icon-css"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addStopover} className="left-btn">
              Add Stopover
            </button>
          </LoadScript>
        </div>
        <div className="route-summary">
          {stopovers.length === 0 ? null : (
            <>
              {pickup} --&gt;{" "}
              {stopovers.map((stp, index) => (
                <span key={index}>
                  {stp.text}
                  {index < stopovers.length - 1 && " --> "}
                </span>
              ))}{" "}
              --&gt; {destination}
            </>
          )}
        </div>
        <button
          onClick={getStopoverDistances}
          className="stopover-btn"
          disabled={loading}
        >
          {loading ? "Calculating..." : "Get Stopover Prices"}
        </button>
        {stopoverDistance.length > 0 && (
          <>
            <h2 className="price-text-stopover">Stopover Distances</h2>
            <ul>
              {stopoverDistance.map((dist, index) => (
                <li key={index}>
                  Stopover {index + 1}: {dist}
                </li>
              ))}
            </ul>
            <h2 className="price-text-stopover">Recommended Price</h2>
            \<div className="price-flex-stopover">
  {stopOverFare.length > 0 && (
    <ul>
      {stopOverFare.map((fare, index) => (
        <li key={index}>
          Stopover {index + 1}: {fare.price}
        </li>
      ))}
    </ul>
  )}
<button
  onClick={() => {
   
    if (stopOverFare.length > 0) {
      const updatedFare = [...stopOverFare];
      updatedFare[updatedFare.length - 1].price += 2; 
      setValue(updatedFare); 
    }
  }}
  className="icons"
>
  <CiCirclePlus />
</button>

<button
  onClick={() => {
    
    if (stopOverFare.length > 0) {
      const updatedFare = [...stopOverFare];
      updatedFare[updatedFare.length - 1].price = Math.max(updatedFare[updatedFare.length - 1].price - 2, 0); // Decrease the price by 2, but not below 0
      setValue(updatedFare); 
    }
  }}
  className="icons"
>
  <CiCircleMinus />
</button>

</div>

          </>
        )}
      </div>
    </>
  );
};

export default StopOvers;
