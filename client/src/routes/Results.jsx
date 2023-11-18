import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Affix } from "antd";
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
        <div>
            <div style={{ display: "flex" }}>
            <h1 style={{paddingLeft:"100px", flex: "1", color:"#0f1df8"}}>Stops</h1>
                <h1 style={{paddingLeft:"0px", flex: "1" , color:"#0f1df8"}}>Medical Facilities</h1>
            </div>
            <div style={{ borderColor:"#0f1df8", borderStyle: "ridge", borderWidth: "10px", display: "flex",borderRadius:"20px", padding:"20px",background:"white" }}>
                <div className="place" style={{ flex: "1", paddingRight:"100px", paddingLeft:"10px" }}>
                    <Lining stops={l_stops} onStepClick={handleStepClick} radius={200}/>
                </div>
                <div style={{ borderColor:"#0f1df8",borderStyle: "ridge",width: "0px", background: "#0f1df8", margin: "0px", padding: "0px", borderRadius:"10px",borderWidth: "5px", boxSizing: "border-box" }}></div>
                <div style={{ flex: "1",paddingLeft:"100px", width:"100%"}}>
                 <Affix offsetTop={10} style={{ flex: "1", width: "100%"  }}>
                <div style={{overflowY:"auto" , maxHeight: "95vh"}}>
                    {currentFacilities.map((facility, index) => (
                        <div className="place" key={index} style={{width:"450px"}}>
                            <h5 style={{color:"#0f1df8"}}>{facility.name}</h5>
                            <p>{facility.address}</p>
                            <p>Phone Number 📞: {facility.phone}</p>
                            <p>Stars ⭐: {facility.stars}</p>
                        </div>
                    ))}
                    </div>
                    </Affix>
                </div>
            </div>
        </div>
    );
}
