import { useState, useEffect } from 'react';
import './Login.css';
import Navbar from '../../Utils/HOC/Navbar';
import { Link, useNavigate } from 'react-router-dom';
//import axiosInstance from '../../Interceptors/axiosInstance';

import axios from 'axios';

const Login = () => {
  const [E_mail, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (E_mail === '' || password === '') {
      alert("Fill mandatory fields 🙂🙂");
    } else {
      try {
        // Make API call to login
        const response = await axios.post('https://backendapiapp-hhgecegpgefhd4bc.canadacentral-01.azurewebsites.net/v1/login', {
          E_mail,
          password,
        });
        console.log(E_mail)
        console.log(password)
        const { access_token, id } = response.data;

        if (access_token && id) {
          // Save both tokens and user ID in localStorage
          localStorage.setItem('token', access_token);
          localStorage.setItem('userID', id.toString());

          console.log(id);
          
          alert("Login successful 🙂🙂");
          
          navigate('/'); // Redirect after login
        } else {
          alert("Token or user ID is missing in the response 🙂🙂");
          console.error('Token or user ID is missing in the response.');
          setError('Token or user ID is missing.');
        }
      } catch (error: any) {
        console.error('Error logging in:', error);
        setError('Invalid credentials, please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="main">
        <form className="form" onSubmit={handleLogin}>
          <input
            className="logininputs"
            placeholder="E-mail"
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={E_mail}
          />

          <input
            className="logininputs"
            placeholder="Password"
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <button className="loginbutton" type="submit">
            Login
          </button>
          <div className="signup-link">
            <Link to="/signup">Don't have an account? Sign Up</Link>
          </div>

          
        </form>

        {/* Display error message */}
        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}

        <div className="img"></div>
      </div>
    </>
  );
};

export default Login;
