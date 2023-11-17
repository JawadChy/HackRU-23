import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../assets/Results.css";
import Lining from "../components/steps";

export default function Resultspage() {
    const [selectedRoute, setSelectedRoute] = useState('');
    const [l_stops, setL_Stops] = useState([]);
    const [currentFacilities, setCurrentFacilities] = useState([]);

    const location = useLocation();
    const { from, to } = location.state || {};

    useEffect(() => {
      const fetchStops = async () => {
          try {
              const response = await fetch(`http://localhost:3000/stops?from=${from}&to=${to}`);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const stopIds = await response.json();
              const stops = stopIds.map(stopId => {
                return { 
                    id: stopId, 
                    title: `Stop ${stopId}`, // or any other title format you have
                    // Add a separate property for the stop ID if it's different from stopId
                };
            });
            setL_Stops(stops);
            
          } catch (error) {
              console.error('Fetch error:', error);
          }
      };
  
      if (from && to) {
          fetchStops();
      }
  }, [from, to]);
  
  
  const handleStepClick = async (index) => {
    const clickedStop = l_stops[index];
    const stopId = clickedStop.id; // Use the id directly
    console.log("Clicked Stop ID:", stopId); // Log for debugging

    setSelectedRoute(clickedStop.title);
    try {
        const response = await fetch(`http://localhost:3000/medical-places?stop=${stopId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const facilities = await response.json();
        setCurrentFacilities(facilities);
    } catch (error) {
        console.error('Fetch error:', error);
    }
  };




    return (
        <div>
            <div style={{ display: "flex" }}>
                <h1 style={{ flex: "1" }}>Selected Route</h1>
                <h2 style={{ flex: "1" }}>Medical Facilities</h2>
            </div>
            <div style={{ display: "flex" }}>
                <div className="place" style={{ flex: "1" }}>
                    <Lining stops={l_stops} onStepClick={handleStepClick} />
                </div>
                <div style={{ flex: "1" }}>
                    {currentFacilities.map((facility, index) => (
                        <div className="place" key={index}>
                            <h5>{facility.name}</h5>
                            <p>{facility.address}</p>
                            <p>Phone Number 📞: {facility.phone}</p>
                            <p>Stars ⭐: {facility.stars}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
