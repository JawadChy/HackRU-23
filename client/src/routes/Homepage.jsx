import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import "../assets/Homepage.css";
import axios from 'axios'
import ComboBox from "../components/ComboBox";

export default function Homepage() {
  const [route, setRoute] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [le_bus_stops, setStop] = useState('');
  const [toOptions, setToOptions] = useState([]);
  const navigate = useNavigate();

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
    if(from.length > 0){
      try {
        const response = await fetch(`http://localhost:3000/stops`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
    
        if (!response.ok) {
          const errorMessage = await response.text(); // Read the error message from the response
          throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorMessage}`);
        }
    
        const stopsData = await response.json();
        navigate("/results", { state: { stopsData, from, to } });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  

  useEffect(() => {
    axios.get('http://localhost:3000/bus_stops')
      .then((response) => {
        setStop(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
    <div>
    <div style={{height: "21vh"}}>

    </div>
    <div className="App" style={{
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: "auto",
      minHeight: "50vh",
      background:"white",
      border: "20px solid #0f1df8", 
      borderRadius: "10px",
      padding: "20px",
      }}>
      <div style={{ display: "flex" }}>
      <img style={{ flex: "1", height:"125px", paddingTop:"30px"}} src="../src/assets/HealthJourneyLogo.png" alt="Logo" />
      <div style={{flex: "1"}}>
        <h1 style={{ color:"#0f1df8", fontFamily:"Roboto", borderBottom:"0px", marginBottom:"0px"}}>Health </h1>
        <h1 style={{ color:"#ffa061", fontFamily:"Roboto", borderTop:"0px", marginTop:"0px"}}>Journey</h1>
      </div>
      </div>
      <ComboBox
        options={Object.keys(le_bus_stops)}
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
          let id_from = 0;
          for (const currStop in le_bus_stops[route].entries()){
            console.log(le_bus_stops[route])
            if (currStop['label'] == from){
              // console.log(currStop['stopid'])
              id_from = currStop['stopid']
            }
          }
          setToOptions(le_bus_stops[route]?.filter(stop => stop['stopid'] > id_from ) || []);
          // console.log("here",le_bus_stops[route]?.filter(stop => stop['stopid'] > id_from ) || []);
        }}
        value={from} 
      />
      <ComboBox
        disabled={!route}
        options={toOptions || []}
        label={"To"}
        handleRouteChange={(event, newInputValue) => {
          setTo(newInputValue);
        }}
        value={to} 
      />
      <Button onClick={handleSubmit} type="primary" size="large" style={{ background: "#ffa061", borderColor: "#ffa061" }}> Find! </Button>
    </div>
    </div>
  );
}