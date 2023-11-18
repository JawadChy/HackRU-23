import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../assets/Results.css";
import Lining from "../components/steps";

export default function Resultspage() {
    const [selectedRoute, setSelectedRoute] = useState([]);
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
                    title: stopId.label,
                };
            });
            setSelectedRoute(stopIds);
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

    const stopId = selectedRoute[index]['stopid']
    
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
            <h1 style={{ flex: "1", color:"#0f1df8"}}>Stops</h1>
                <h1 style={{paddingLeft:"200px", flex: "1" , color:"#0f1df8"}}>Medical Facilities</h1>
            </div>
            <div style={{ display: "flex" }}>
                <div className="place" style={{ flex: "1", paddingRight:"100px" }}>
                    <Lining stops={l_stops} onStepClick={handleStepClick} />
                </div>
                <div style={{ width: "5px", background: "#0f1df8", margin: "0px", padding: "0px", border: "none", boxSizing: "border-box" }}></div>
                <div style={{ flex: "1",paddingLeft:"150px"}}>
                    {currentFacilities.map((facility, index) => (
                        <div className="place" key={index}>
                            <h5 style={{color:"#0f1df8"}}>{facility.name}</h5>
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
