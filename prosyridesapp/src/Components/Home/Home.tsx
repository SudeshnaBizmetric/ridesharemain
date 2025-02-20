import './Home.css';
import Navbar from '../../Utils/HOC/Navbar';
//import { useState } from 'react';
import Footer from '../../Utils/HOC/Footer';

interface FAQ {
  question: string;
  answer: string;
}

const Home = () => {
  
  const faq: FAQ[] = [
    {
      question: "How does carpooling work?",
      answer: "Carpooling allows multiple people to share a ride in one vehicle. As a rider, you can search for drivers heading in the same direction, and as a driver, you can offer empty seats in your vehicle to share with others. It's a great way to save money, reduce traffic congestion, and help the environment by lowering carbon emissions."
    },
    {
      question: "Is carpooling safe?",
      answer: "Yes, carpooling is safe. Our platform verifies user profiles through email and phone number verification. We encourage drivers and riders to provide feedback and reviews after each ride, ensuring transparency. Additionally, we offer special rides for women, allowing women to choose female-only rides for added safety."
    },
    {
      question: "How do I book a ride?",
      answer: "To book a ride, simply enter your pickup location and destination, select from the available carpool rides, and book a seat with the driver of your choice. You can then communicate with the driver through the platform to confirm details."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods, including credit cards, debit cards, and popular mobile payment services. All transactions are secured and processed through our platform."
    },
    {
      question: "Can I cancel my ride after booking?",
      answer: "Yes, you can cancel your ride up to 1 hour before the scheduled departure time. However, please be aware that cancellation fees may apply depending on our cancellation policy."
    }, {
      question: "How do I become a driver on the platform?",
      answer: "To become a driver, you need to create an account and provide information about your vehicle, including make, model, and capacity. After submitting your application, our team will review it and notify you once you’re approved."
    },
    {
      question: "What happens if a driver cancels a ride?",
      answer: "If a driver cancels a ride, you will receive a notification, and your booking will be automatically canceled. You can then search for alternative rides on the platform."
    },
    {
      question: "How are fares calculated?",
      answer: "Fares are calculated based on the distance of the trip, the number of passengers, and any additional fees such as tolls or parking. You will see the fare estimate before confirming your booking."
    },
    {
      question: "Can I bring luggage with me?",
      answer: "Yes, you can bring luggage with you, but please communicate with the driver beforehand to ensure they have enough space in their vehicle."
    },
    {
      question: "What if I have more questions?",
      answer: "If you have more questions or need assistance, feel free to contact our customer support team through the app or website. We're here to help!"
    }
    
  ];

  

 

  return (
    <>
     <Navbar />
     
 
  <div className="Bg">
  <div className='boxes'>
        <div className='box'>
          <span className='title'>Easy</span>
          <br />
          <br />
         <span className='content-text'>Save time with a streamlined process that gets you where you need to go in just a few clicks.</span> 
        </div>
        <div className='box'>
          <span className='title'>Profitable</span>
          <br />
          <br />
          <span className='content-text'>Turn your everyday commute into a source of income by offering rides to fellow travelers. It’s a win-win for everyone.</span> 
        </div>
        <div className='box'>
          <span className='title'>Affordable</span>
          <br />
          <br />
          <span className='content-text'>Enjoy low-cost travel solutions without compromising on comfort or convenience. Get where you need to go without breaking the bank.</span>
        </div>
      </div>
   
    
  </div>
  <div className='mostlyaskedquestions'>
    <div className='questions-text'>Mostly asked questions</div>
    <div className="accordion" id="accordionExample">
  {faq.map((faq, index) => (
    <div key={index} className="accordion-item" >
      <h2 className="accordion-header" >
        <button 
          className="accordion-button" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target={`#collapse${index}`} 
          aria-expanded="true" 
          aria-controls={`collapse${index}`}
        >
          {faq.question}
        </button>
      </h2>
      <div 
        id={`collapse${index}`} 
        className="accordion-collapse collapse" 
        aria-labelledby={`heading${index}`} 
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <strong>{faq.answer}</strong>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>

      

     

    <Footer />
     
    </>
  );
}

export default Home;
