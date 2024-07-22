// TODO: for backend use strapi
// first follow this tute https://strapi.io/blog/strapi-authentication-with-react
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
