import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import './App.css'
import SignUp from './pages/sign-up'
import SignIn from "./pages/sign-in"
import Dashboard from "./pages/Dashboard"
import { getToken } from "./helper-functions/authToken";
import Account from "./pages/Account.jsx"
import Profile from "./pages/Profile.jsx"
import Projects from './pages/Projects.jsx';

function App() {
console.log('here')
console.log(getToken())
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element=
            {!getToken() ? <SignUp /> : <Navigate to="/all-projects" replace={true}/>}
        />
        <Route 
          path="/sign-in" 
          element=
            { !getToken() ? <SignIn /> : <Navigate to="/all-projects" replace={true}/>}
        />
        <Route 
          path="/all-projects" 
          element=
            { getToken() ? <Projects tab='all-projects' /> : <Navigate to="/sign-in" replace={true}/>}
        />
        <Route 
          path="/my-projects" 
          element={getToken() ?<Projects tab='my-projects'/>: <Navigate to="/sign-in" replace={true}/>}
        />
        <Route 
          path="/profile" 
          element={getToken() ?<Profile />: <Navigate to="/sign-in" replace={true}/>} 
        />
        <Route 
          path="/account" 
          element={getToken() ?<Account/>: <Navigate to="/sign-in" replace={true}/>}
        />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
