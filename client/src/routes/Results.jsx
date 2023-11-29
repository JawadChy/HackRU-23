import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Affix, Divider } from "antd";
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
  
  
  const handleStepClick = async (index,radius) => {

    const stopId = selectedRoute[index]['stopid']
    
    try {
        const response = await fetch(`http://localhost:3000/medical-places?stop=${stopId}&radius=${radius}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const facilities = await response.json();
        if(facilities.length === 0){
            handleStepClick(index,radius+50)
        }
        else{
            setCurrentFacilities(facilities);
        }
        console.log(facilities)
    } catch (error) {
        console.error('Fetch error:', error);
    }
  };

    return (
    <>
        <div className="header">
            <h1 >Stops</h1>
            <h1 >Medical Facilities</h1>
        </div>
        <div className="container">
            <div className="place">
                <Lining stops={l_stops} onStepClick={handleStepClick} radius={200}/>
            </div>
            <div className="affix-container">
                <Affix className="affix-container" offsetTop={10} style={{ flex: "1"}}>
                    <div className="facility-list">
                        {currentFacilities.map((facility, index) => (
                            <div className="place" key={index} style={{width:"100%"}}>
                                {index < 3 && <h4 style={{margin:"0px"}}>Sponsored</h4>}
                                <h3 style={{color:"#0f1df8", marginTop:"0px"}}>{facility.name}</h3>
                                <p>{facility.address}</p>
                                <p>Phone Number 📞: {facility.phone}</p>
                                <p>Stars ⭐: {facility.stars}</p>
                                <Divider type="horizontal" />
                            </div>
                        ))}
                    </div>
                </Affix>
            </div>
        </div>
    </>
    );
}
