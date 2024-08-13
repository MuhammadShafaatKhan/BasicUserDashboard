import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import './App.css'
import SignUp from './pages/sign-up'
import SignIn from "./pages/sign-in"
import Dashboard from "./pages/Dashboard"
import { getToken } from "./helper-functions/authToken";

function App() {
console.log('here')
console.log(getToken())
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route 
          path="/sign-in" 
          element=
            { !getToken() ? <SignIn /> : <Navigate to="/dashboard" replace={true}/>}
        />
        <Route 
          path="/dashboard" 
          element=
            { getToken() ? <Dashboard /> : <Navigate to="/sign-in" replace={true}/>}
        />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
