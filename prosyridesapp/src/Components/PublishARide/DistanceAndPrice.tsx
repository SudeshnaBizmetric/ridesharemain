import { memo, useState, useEffect } from "react";
import "../../Utils/GlobalCSS/button.css";
import "./PublishRide.css";
import { LoadScript } from "@react-google-maps/api";
import { API_KEY } from "../../Utils/Constants/API_KEY";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";

const DistanceAndPrice: React.FC<{
  pickup: string;
  destination: string;
  setValue: React.Dispatch<React.SetStateAction<number>>;
  fare: number;
}> = memo(({ pickup, destination, setValue, fare }) => {
  const [distance, setDistance] = useState<{ distance: string; duration: string } | null>(null);

  const [loading, setLoading] = useState<boolean>(false); // For button loading state
  
  // Function to fetch distance and duration
  const getDistance = () => {
    if (!pickup || !destination) {
      alert("Pickup or Destination is missing!");
      return;
    }

    setLoading(true);
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pickup],
        destinations: [destination],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response: any, status: any) => {
        setLoading(false);
        console.log("Distance API Response:", response);

        if (status === google.maps.DistanceMatrixStatus.OK) {
          const element = response.rows[0].elements[0];
          if (element.status === "OK") {
            const distanceText = element.distance.text; // e.g., "1,154 km"
            const durationText = element.duration.text; // e.g., "21 hours 44 mins"
            setDistance({ distance: distanceText, duration: durationText });
          } else {
            alert(`Error: ${element.status}`);
          }
        } else {
          alert(`Error: ${status}`);
        }
      }
    );
  };

  // Function to calculate the fare based on distance
  const calculateFare = (distanceString: string) => {
    console.log("Distance String:", distanceString);
    const cleanDistanceText = distanceString.replace(/,/g, ""); // Remove commas from the distance text
    const match = cleanDistanceText.match(/\d+(\.\d+)?/);

    if (match) {
      const distanceValue = parseFloat(match[0]); // Parse numeric distance
      const calculatedFare = parseFloat((distanceValue * 2).toFixed(2)); // Example fare calculation
      console.log("Calculated Fare:", calculatedFare);
      return calculatedFare;
    }
    console.warn("No numeric distance found in string:", distanceString);
    return 0;
  };

  // Effect to update fare whenever the distance is fetched
  useEffect(() => {
    if (distance) {
      const calculatedFare = calculateFare(distance.distance);
      console.log("Setting Fare State to:", calculatedFare);
      setValue(calculatedFare);
    }
  }, [distance, setValue]);

  // Function to determine the fare status
  // const getFareStatus = () => {
  //   console.log("Fare:", fare);
  //   console.log("OverFare:", overFare);
  //   console.log("UnderFare:", underFare);

  //   if (fare >= overFare) {
  //     return {
  //       message: [
  //         "You are overpriced!",
  //         "Passengers are likely to find rides that are cheaper than yours.",
  //       ],
  //       className: "over-price",
  //     };
  //   } else if (fare <= underFare) {
  //     return {
  //       message: [
  //         "You are underpriced!",
  //         "Consider increasing your price to better share.",
  //         "You'll get passengers in no time!",
  //       ],
  //       className: "lower-price",
  //     };
  //   } else {
  //     return {
  //       message: ["Price is just right!"],
  //       className: "price",
  //     };
  //   }
  // };

  // const fareStatus = getFareStatus();

  return (
    <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
      <div className="left-Fare">
        <button onClick={getDistance} className="btn" disabled={loading}>
          {loading ? "Calculating..." : "Set Price for ride"}
        </button>

        {distance && (
          <>
            <p className="distance-duration">
              Distance: {distance.distance} 
              <p></p>
              Duration: {distance.duration}
            </p>

            <div className="price-flex">
              <button
                onClick={() => {
                  const newFare = fare - 10;
                  console.log("New Fare after Decrement:", newFare);
                  setValue(newFare);
                }}
                className="icons"
              >
                <CiCircleMinus />
              </button>
              <p >{fare}</p>
              <button
                onClick={() => {
                  const newFare = fare + 10;
                  console.log("New Fare after Increment:", newFare);
                  setValue(newFare);
                }}
                className="icons"
              >
                <CiCirclePlus />
              </button>
            </div>

            
          </>
        )}
      </div>
    </LoadScript>
  );
});

export default DistanceAndPrice;
