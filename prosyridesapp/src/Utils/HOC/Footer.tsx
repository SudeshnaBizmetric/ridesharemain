// import { FaInstagram } from "react-icons/fa";
// import { FaFacebookSquare } from "react-icons/fa";
// import { IoLogoYoutube } from "react-icons/io";
// import { FaTwitterSquare } from "react-icons/fa";
import TermsModal from "./TermsModal";
import { useState } from "react";

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  return (
   
       <div className='footer'>
         <div>
      <label>
    
        <span
          style={{ color: "blue", cursor: "pointer" ,textDecoration:'underline'}}
          onClick={() => setShowTerms(true)}
        >
          Terms & Conditions
        </span>
      </label>

      <TermsModal show={showTerms} handleClose={() => setShowTerms(false)} />
    </div>
         {/* <div className='right'>
          <span className='footer-icon'> <FaFacebookSquare/></span>
          <span className='footer-icon'> <FaInstagram/></span>
          <span className='footer-icon'><FaTwitterSquare/></span>
          <span className='footer-icon'><IoLogoYoutube/></span>  
         </div> */}
      </div>
   
  )
}

export default Footer
