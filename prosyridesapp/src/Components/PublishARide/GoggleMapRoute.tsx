import { memo, useEffect, useState } from "react";
import {
  DirectionsRenderer,
  GoogleMap,
  LoadScript,
} from "@react-google-maps/api";
import { API_KEY } from "../../Utils/Constants/API_KEY";
import "./PublishRide.css";

interface RouteOption {
  id: number;
  directions: google.maps.DirectionsResult;
}

const GoogleMapRoute: React.FC<{ pickup: string; destination: string }> = memo(
  ({ pickup, destination }) => {
    const [routes, setRoutes] = useState<RouteOption[]>([]);
    const [, setIsLoading] = useState(false);

    const showRoute = () => {
      if (!pickup || !destination) return; 

      setIsLoading(true); 
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: pickup,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true, 
        },
        (result, status) => {
          setIsLoading(false); 
          if (status === google.maps.DirectionsStatus.OK && result != null) {
            
            const routeOptions = result.routes.map((route, index) => ({
              id: index,
              directions: { ...result, routes: [route] },
            }));
            setRoutes(routeOptions);
          } else {
           
            console.error("Failed to load directions:", status);
          }
        }
      );
    };

    useEffect(() => {
      if (pickup && destination) {
        showRoute(); 
      }
    }, [pickup, destination]);

    return (
      <LoadScript googleMapsApiKey={API_KEY} libraries={["places"]}>
        <div className="map-container">
          <GoogleMap
            id="autocomplete-map"
            zoom={10}
            center={{ lat: 28.6139, lng: 77.209 }} 
          >
            {routes.map((route) => (
              <DirectionsRenderer
                key={route.id}
                directions={route.directions}
              />
            ))}
          </GoogleMap>
        </div>
      </LoadScript>
    );
  }
);

export default GoogleMapRoute;
