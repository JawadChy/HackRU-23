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
  const [busRoutes, setBusRoutes] = useState([]);
  
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
    resetFromToFields();
  };

  const resetFromToFields = () => {
    setFrom("");
    setTo("");
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

      navigate("/results", { state: { from, to } });
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    axios.get('http://localhost:3000/bus_stops')
      .then((response) => {
        setStop(response.data);
        const routes = [];
        for (const key in response.data) {
          routes.push({ label: key });
        }
        setBusRoutes(routes); // Set the bus routes here
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  

  return (
    <div className="App">
      <div style={{ display: "flex" }}>
      <img style={{ flex: "1", width: "0px", height:"125px", paddingTop:"30px"}} src="../src/assets/HealthJourneyLogo.png" alt="Logo" />
      <h1 style={{ flex: "1" }}>Health Journey</h1>
      </div>
      <ComboBox
        options={busRoutes}
        label={"Route"}
        handleRouteChange={handleRouteChange}
        value={route} 
      />
      <ComboBox
        disabled={!route}
        options={le_bus_stops[route] || []}
        label={"From"}
        handleRouteChange={(event, newInputValue) => {
          setFrom(newInputValue);
        }}
        value={from} 
      />
      <ComboBox
        disabled={!route}
        options={le_bus_stops[route] || []}
        label={"To"}
        handleRouteChange={(event, newInputValue) => {
          setTo(newInputValue);
        }}
        value={to} 
      />
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}