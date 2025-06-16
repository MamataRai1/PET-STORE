import { useState, useEffect } from 'react';
import axios from "axios";
import Navbar from './components/Navbar';

function App() {
  const [routers, setRouters] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/routers/")  // 🛠️ FIXED URL
      .then(response => {
        setRouters(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the routers!", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-xl font-bold">Available API Routes:</h1>
        <ul className="list-disc pl-5">
          {routers.map((route, i) => (
            <li key={i}>{route.name} - {route.url}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
