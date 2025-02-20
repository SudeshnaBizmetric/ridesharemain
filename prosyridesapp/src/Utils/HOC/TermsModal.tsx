import React from "react";
import { Modal } from "react-bootstrap";

interface TermsModalProps {
  show: boolean;
  handleClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Terms & Conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>1. User Responsibilities:</strong> You must provide accurate ride details.</p>
        <p><strong>2. Booking & Payments:</strong> Ride fares are non-refundable once confirmed.</p>
        <p><strong>3. Cancellations & No-shows:</strong> Notify at least 3 hours in advance.</p>
        <p><strong>4. Safety Guidelines:</strong> Passengers and drivers must follow the app’s safety policies.</p>
        <p><strong>5. Liability:</strong> The app is not responsible for accidents, delays, or disputes.</p>
        <p><strong>6. Privacy Policy:</strong> User data is handled per our privacy policy.</p>
      </Modal.Body>
      <Modal.Footer>
       
      </Modal.Footer>
    </Modal>
  );
};

export default TermsModal;
