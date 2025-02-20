import { IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import logo from '../../Images/Icon-prosy.png'
import './Navbar.css';
import { FaUserCircle } from 'react-icons/fa';
import { memo, useState } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LiaCarSideSolid } from "react-icons/lia";
import {CiCirclePlus } from "react-icons/ci";

const Navbar = memo(() => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    window.location.href = '/'; 
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="Navbar">
       <a href='/'> <img className="logo" src={logo} alt="logo" /></a>

      <div className="Search-Box">
        <Link to="/search">
        <IoSearch className="search-icon" />
        <input className="Search" placeholder="Search Rides" /></Link>
       
      </div>

      <div className="space"></div>

      {isAuthenticated ? (
        <>
          <Link to="/PublishRide">
            <button className="linkbtn"><span className='plusicon'><CiCirclePlus/></span> Publish a ride</button>
          </Link>

          <div className="profile">
            <button className="profile-btn" onClick={toggleDropdown}>
              <FaUserCircle className="profile-icon" />
            </button>
            {dropdownOpen && (
              <div className="dropdown-content">
                <Link to="/your-rides"><button className="linkbtn"><span className='icon'><LiaCarSideSolid /></span>  Ride requests</button></Link>
                <Link to="/userprofile"><button className="linkbtn"><span className='icon'><HiOutlineUserCircle /></span>  Your Profile</button></Link>   
                <Link to="/"><button className="linkbtn" onClick={handleLogout}><span className='icon'><IoIosCloseCircleOutline /></span>  Logout</button></Link>
                
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link to="/PublishRide">
            <button className="linkbtn">Publish a ride  </button>
          </Link>
          
          <Link to="/login">
            <button className="linkbtn">Login  </button>
          </Link>
        
          <Link to="/signup">
            <button className="linkbtn">Sign Up  </button>
          </Link>
        </>
      )}
    </div>
  );
});

export default Navbar;
