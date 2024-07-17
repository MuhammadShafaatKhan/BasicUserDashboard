// TODO: for backend use json server: https://dev.to/jyeett/the-basic-necessities-of-a-mock-user-authentication-with-json-server-auth-2onj
// once complete dashboard working, move backend to strapi
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import SignUp from './pages/sign-up'
import SignIn from "./pages/sign-in";

function App() {
  

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/sign-in/" element={<SignIn />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
