import { useEffect, useState } from "react";
//import { useParams } from "react-router-dom";
import axios from "axios";
import './Bookeduser.css'
import Navbar from "../../Utils/HOC/Navbar";
interface BookedUser {
    Name: string;
    E_mail: string;
    Phone_number: string;
    About: string;
    Vehicle: string;
    Travel_Preference_Music: string;
    Travel_Preference_Pets: string;
    Travel_Preference_Smoking: string;
    Travel_Preference_Conversation: string;
}

const Bookeduser = () => {
    
    const [bookeduserinfo, setBookedUserInfo] = useState<BookedUser | null>(null);
    const [bookeduserextrainfo, setBookedUserextraInfo] = useState<BookedUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
   // console.log("Booked User ID:", bookeduserid);
   const id = localStorage.getItem("userid");
    useEffect(() => {
        const getBookedUserInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/bookeduserinfo/${id}`);
                setBookedUserInfo(response.data);
                console.log("Updated Booked User Info:", response.data);
            } catch (error) {
                console.error("Error fetching booked user info:", error);
                setError("Failed to fetch user info.");
            } finally {
                setLoading(false);
            }
        };
        const getBookedUserextraInfo = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/v1/bookeduserextrainfo/${id}`);
                setBookedUserextraInfo(response.data);
                console.log("Updated Booked User Info:", response.data);
            } catch (error) {
                console.error("Error fetching booked user info:", error);
                setError("Failed to fetch user info.");
            } finally {
                setLoading(false);
            }
        };
   
        if (id) {
            getBookedUserInfo();
            getBookedUserextraInfo()
        }
    }, [id]);

    if (loading) return <p>Loading user data...</p>;
    if (error) return <p>{error}</p>;
    if (!bookeduserinfo) return <p>No user found.</p>;

    return (
        <>
        <Navbar />
        <div className="bg">
        <div className="bookeduser">
         <div className="user-info-bookeduser">
            <div className="info-text">
              <span className="property">{bookeduserinfo.Name}</span>
            </div>
            <div className="info-text">
              <span className="property">{bookeduserinfo.E_mail}</span>
            </div>
            <div className="info-text">
              <span className="property">{bookeduserinfo.Phone_number}</span>
            </div>
         </div>
        <div className="extra-info-bookeduser">
        <div className="info-text">
            <span className="title-text">About</span>
            <span className="property">{bookeduserextrainfo ? bookeduserextrainfo.About : "No information available"}</span>
        </div>
        <div className="info-text">
            <span className="title-text">Vehicle</span>
            <span className="property">{bookeduserextrainfo ? bookeduserextrainfo.Vehicle : "No information available"}</span>
        </div>
        <div className="info-text">
            <span className="title-text">Music</span>
            <span className="property">{bookeduserextrainfo ? bookeduserextrainfo.Travel_Preference_Music : "No information available"}</span>
        </div>
        <div className="info-text">
            <span className="title-text">Pet</span>
            <span className="property">{bookeduserextrainfo ? bookeduserextrainfo.Travel_Preference_Pets: "No information available"}</span>
        </div>
        <div className="info-text">
            <span className="title-text">Smoking</span>
            <span className="property">{bookeduserextrainfo ? bookeduserextrainfo.Travel_Preference_Smoking : "No information available"}</span>
        </div>
        <div className="info-text">
            <span className="title-text">Conversation</span>
            <span className="property">{bookeduserextrainfo ? bookeduserextrainfo.Travel_Preference_Conversation: "No information available"}</span>
        </div>

        </div>
        
        </div>
        </div>
        </>
    );
};

export default Bookeduser;
