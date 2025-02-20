import './RegisterUser.css';
import Navbar from '../../Utils/HOC/Navbar';
import { useState } from 'react';
import axios from 'axios';

const RegisterUser = () => {
  const [Name, setName] = useState<string>("")
  const [E_mail, setEmail] = useState<string>("")
  const [Phone_number, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [Confirm_Password, setConfirmPassword] = useState<string>("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const HandleUser = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const newError: { [key: string]: string } = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(E_mail)) {
      newError.E_mail = "Invalid email format.";
    }

    if (password !== Confirm_Password) {
      newError.password = "Passwords do not match.";
    }

    if (Object.keys(newError).length > 0) {
      setErrors(newError);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/v1/users", {
        Name,
        E_mail,
        Phone_number:(Phone_number), // Convert to number before sending
        password,
      });

      alert("User registered successfully!");
      console.log(response);
    } catch (error) {
      console.error("Error registering user", error);
    }
  };

  return (
    <>
     <Navbar />
      <div className="main">
        <form className="form" onSubmit={HandleUser}>
          <input
            className="Register-inputs"
            placeholder="First name    Last name"
            value={Name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="Register-inputs"
            placeholder="E-mail"
            value={E_mail}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.E_mail && <p className="error-message">{errors.E_mail}</p>}
          <input
  className="Register-inputs"
  placeholder="Phone Number"
  value={Phone_number}
  required
  onChange={(e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { 
      setPhone(value);
    }
  }}
/>

          <input
            className="Register-inputs"
            placeholder="Password"
            type='password'
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="Register-inputs"
            placeholder="Confirm Password"
            type='password'
            value={Confirm_Password}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
          <button className="registerbutton" type="submit">Sign Up</button>
        </form>
        <div className="bg-img"></div>
      </div>
    </>
  );
};

export default RegisterUser;
