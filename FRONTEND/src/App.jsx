import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from "axios";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';


function App() {
  const [routers, setRouters] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/routers/")
      .then(response => setRouters(response.data))
      .catch(error => console.error("Error fetching routers:", error));
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        {/* Add more routes as needed */}
      </Routes>

      {routers.length > 0 && (
        <div className="p-4">
          <h1 className="text-xl font-bold">API Routes:</h1>
          <ul className="list-disc pl-5">
            {routers.map((route, i) => (
              <li key={i}>{route.name} - {route.url}</li>
            ))}
          </ul>
        </div>
      )}

      <Footer />
    </>
  );
}

export default App;
