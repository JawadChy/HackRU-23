import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Homepage.css";
import axios from 'axios'
import ComboBox from "../components/ComboBox";

export default function Homepage() {
  const [route, setRoute] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [le_bus_stops, setStop] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:3000/bus_stops')
      .then((response) => {
        setStop(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleRouteChange = (event, newInputValue) => {
    setRoute(newInputValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      from: from,
      to: to,
    };

    try {
      const response = await fetch("http://localhost:3000/submit-locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      navigate("/results");
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const bus_routes = [];
  
  for (const key in Object.keys(le_bus_stops)){
    if (le_bus_stops[key]) {
      const route = {"label":key};
      bus_routes.push(route);
    }
  }

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
      <img style={{ flex: "1", width: "0px", height:"125px", paddingTop:"30px"}} src="../src/assets/HealthJourneyLogo.png" alt="Logo" />
      <h1 style={{ flex: "1" }}>Health Journey</h1>
      </div>
      <ComboBox
        options={bus_routes}
        label={"Route"}
        handleRouteChange={handleRouteChange}
      />
      <ComboBox
        disabled={!route}
        options={le_bus_stops[route] || []}
        label={"From"}
        handleRouteChange={(event, newInputValue) => {
          setFrom(newInputValue);
        }}
      />
      <ComboBox
        disabled={!route}
        options={le_bus_stops[route] || []}
        label={"To"}
        handleRouteChange={(event, newInputValue) => {
          setTo(newInputValue);
        }}
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
