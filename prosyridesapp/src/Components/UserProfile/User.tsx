import { useEffect, useState } from "react";
import Navbar from "../../Utils/HOC/Navbar";
import axios from "axios";
import "./User.css";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import Swal from "sweetalert2";
import { LiaCarSideSolid } from "react-icons/lia";
import { IoPersonOutline } from "react-icons/io5";
import { SiTheconversation } from "react-icons/si";
import { FaMusic } from "react-icons/fa";
import { FaSmoking } from "react-icons/fa";
import { MdOutlinePets } from "react-icons/md";



interface User {
  Name: string;
  E_mail: string;
  Phone_number: string;
}

interface UserExtraInfo {
  About: string;
  Vehicle: string;
  Travel_Preference_Music: string;
  Travel_Preference_Pets: string;
  Travel_Preference_Smoking: string;
  Travel_Preference_Conversation: string;
}

const User = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userExtraInfo, setUserExtraInfo] = useState<UserExtraInfo | null>(null);
  const [about, setAbout] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [travelPreferenceMusic, setTravelPreferenceMusic] = useState("");
  const [travelPreferencePets, setTravelPreferencePets] = useState("");
  const [travelPreferenceSmoking, setTravelPreferenceSmoking] = useState("");
  const [travelPreferenceConversation, setTravelPreferenceConversation] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    window.location.href = '/'; 
  };
  const getUser = async () => {
    const id = localStorage.getItem("userID");
    if (!id) return;

    try {
      const response = await axios.get(`https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/users/${id}`);
      setUser(response.data);
     
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getUserInfo = async () => {
    const id = localStorage.getItem("userID");
    if (!id) return;

    try {
      const response = await axios.get(`https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/users_extra_info/${id}`);
      setUserExtraInfo(response.data);
      if (response.data?.isposted) {
        setIsPosted(true);
        localStorage.setItem("isPosted", "true");
      }
    } catch (error) {
      console.error("Error fetching user extra info:", error);
    }
  };

  const postMoreInfo = async (event: React.FormEvent) => {
    event.preventDefault();

    const userID = localStorage.getItem("userID");
    const token = localStorage.getItem("token");
    if (!userID || !token) return;

    const formData = {
      UserID: userID,
      About: about,
      Vehicle: vehicle,
      Travel_Preference_Music: travelPreferenceMusic,
      Travel_Preference_Pets: travelPreferencePets,
      Travel_Preference_Smoking: travelPreferenceSmoking,
      Travel_Preference_Conversation: travelPreferenceConversation,
      isposted: true,
    };

    try {
      const response = await axios.post(
        `https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/userextrainformation/${userID}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setUserExtraInfo(response.data);
      setIsPosted(true);
      localStorage.setItem("isPosted", "true");
      getUserInfo();
    } catch (error) {
      console.error("Error posting data", error);
    }
  };
 
  const deleteuser = async () => {
    const id = localStorage.getItem("userID");
    if (!id) return;
  
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/deleteuser/${id}`);
          setUser(response.data); // Update state if needed
  
          Swal.fire("Deleted!", "The user account has been deleted.", "success");
  
         handleLogout()
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error!", "Failed to delete the account. Please try again.", "error");
        }
      }
    });
   
  };

  useEffect(() => {
    getUser();
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar />
      <div className="verticledivdation">
      <div className="topimage"></div> 
      <div className="user">
         
         {isPosted ? (
           userExtraInfo ? (
             <div className="extra-info">
               <div className="bookeduserup">
                
                 <div className="info-text">
                   <span className="title-icons"> <LiaCarSideSolid /></span>
                   <span className="property"> {userExtraInfo.Vehicle}</span>
                 </div>
                 <div className="info-text">
                   <span className="title-icons"><IoPersonOutline /></span>
                   <span className="property"> {userExtraInfo.About}</span>
                 </div>
               </div>
               <div className="bookeduserdown">

                 <div className="info-text">
                  <span className="title-icons"><SiTheconversation /></span>
                   <span className="title-text"></span>
                   <span className="property"> {userExtraInfo.Travel_Preference_Conversation}</span>
                 </div>
                 <div className="info-text">
                 <span  className="title-icons"><FaMusic /></span>
                   <span className="title-text"></span>
                   <span className="property"> {userExtraInfo.Travel_Preference_Music}</span>
                 </div>
                 <div className="info-text">
                 <span  className="title-icons"><MdOutlinePets /></span>
                   <span className="title-text"></span>
                   <span className="property"> {userExtraInfo.Travel_Preference_Pets}</span>
                 </div>
                 <div className="info-text">
                 <span  className="title-icons"><FaSmoking /></span>
                   <span className="title-text"></span>
                   <span className="property"> {userExtraInfo.Travel_Preference_Smoking}</span>
                 </div>
               </div>
             </div>
           ) : (
             <p>Loading user extra info...</p>
           )
         ) : (
           
           <form className="form" onSubmit={postMoreInfo}>
            <div className="extra-info-user">
             <textarea
               className="about"
               placeholder="Tell us about yourself..."
               value={about}
               required
               onChange={(e) => setAbout(e.target.value)}
             />

             <input
               className="vehicle"
               placeholder="Enter your vehicle details..."
               value={vehicle}
               required
               onChange={(e) => setVehicle(e.target.value)}
             />

             <div className="preferences">
               <label>Select Travel Preference Music</label>
               <select required onChange={(e) => setTravelPreferenceMusic(e.target.value)} value={travelPreferenceMusic}>
                 <option value="">Select Music Preference</option>
                 <option value="It is all about the playlist!">It is all about the playlist!</option>
                 <option value="I will jam depending on the mood">I will jam depending on the mood</option>
                 <option value="Silence is golden">Silence is golden</option>
                 <option value="I am a podcast person">I am a podcast person</option>
               </select>
             </div>

             <div className="preferences">
               <label>Select Travel Preference Pets</label>
               <select required onChange={(e) => setTravelPreferencePets(e.target.value)} value={travelPreferencePets}>
                 <option value="">Select Pets Preference</option>
                 <option value="Pets welcome. woof!">Pets welcome. woof!</option>
                 <option value="I will travel with pets depending on the animal">I will travel with pets depending on the animal</option>
                 <option value="I would prefer not to travel with pets">I would prefer not to travel with pets</option>
               </select>
             </div>

             <div className="preferences">
               <label>Select Travel Preference Smoking</label>
               <select required onChange={(e) => setTravelPreferenceSmoking(e.target.value)} value={travelPreferenceSmoking}>
                 <option value="">Select Smoking Preference</option>
                 <option value="I’m fine with smoking">I’m fine with smoking</option>
                 <option value="Cigarette breaks outside the car are ok">Cigarette breaks outside the car are ok</option>
                 <option value="No smoking, please">No smoking, please</option>
               </select>
             </div>
             
             <div className="preferences">
               <label>Select Travel Preference Conversation</label>
               <select required onChange={(e) => setTravelPreferenceConversation(e.target.value)} value={travelPreferenceConversation}>
                 <option value="">Select conversation Preference</option>
                 <option value="I prefer silence">I prefer silence</option>
                 <option value="I am chatty">I am chatty</option>
                 <option value="Do not disturb">Do not disturb</option>
               </select>
             </div>
             <button className="button" type="submit">Save</button>
             </div>
           </form>
          
         )}
      
     </div>
  
      </div>
      
  
<div className="user-profile">
  {user ? (
    <>
      <div className="profile-pic-container">
        <img className="profile-pic"   />
      </div>
      <p className="name">{user.Name}</p>
      <p className="email">
        <MdOutlineMailOutline /> {user.E_mail}
      </p>
      <p className="phone">
        <FiPhone /> {user.Phone_number}
      </p>
      <div>
        <button className="deleteaccountbutton" onClick={deleteuser}>
          Delete account
        </button>
      </div>
    </>
  ) : (
    <p>Loading user data...</p>
  )}
</div>

         
    </>
  );
};

export default User;
