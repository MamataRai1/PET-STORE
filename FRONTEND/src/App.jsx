import { useState, useEffect } from 'react'
import axios from "axios";


function App() {
  const [routers, setRouters] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3000/api/routers")
      .then(response => {
        setRouters(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the routers!", error);
      });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Available API Routes:</h1>
      <ul className="list-disc pl-5">
        {routers.map((route, i) => (
          <li key={i}>{route.name} - {route.url}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
