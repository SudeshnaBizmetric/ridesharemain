import { BrowserRouter as Router ,Routes ,Route } from 'react-router-dom'
import './App.css'
import Home from './Components/Home/Home'
import RegisterUser from './Components/UserRegistration/RegisterUser'
import Login from './Components/UserLogin/Login'
import BookARide from './Components/BookARide/BookARide'
import PublishRide from './Components/PublishARide/PublishRide'
import User from './Components/UserProfile/User'
import User_Rides from './Components/UserProfile/User_Rides'
import Bookeduser from './Components/UserProfile/Bookeduser'
function App() {
  

  return (
    <> 
     
   
     <Router>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/signup' element={<RegisterUser/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/RideBooking' element={<BookARide/>}></Route>
        <Route path='/PublishRide' element={<PublishRide pickup={''} destination={''} stopovers={[]}/>}></Route>
        <Route path='/userprofile' element={<User/>}></Route>
        <Route path='/your-rides' element={<User_Rides/>}></Route>
        <Route path='/search' element={<BookARide/>}></Route>
        <Route path='/your-rides/bookeduser' element={<Bookeduser  />}></Route>
      </Routes>
     </Router>
    </>
  )
  
}

export default App
