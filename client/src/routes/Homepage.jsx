import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import NavbarComponent from "../components/nav/nav";
import "../assets/Homepage.css";
import axios from 'axios'
import ComboBox from "../components/ComboBox";
import Card from "antd/es/card/Card";
import { Divider } from 'antd';
import njcornerlogo from '../assets/NJtransitcornerlogo.png'

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
    <>
    <NavbarComponent/>
    <div style={{height:"20vh",padding:"0px",}}/>
    <Card hoverable="true" style={{ padding:"0px",display: "flex", flexDirection: "column", alignItems: "center"}} >
      <div style={{ padding:"0px",display: "flex" ,width:"50%"}}>
        <img style={{ flex: "1", height:"125px", paddingTop:"30px", marginRight:"0px",borderRight:"0px"}} src="../src/assets/HealthJourneyLogo.png" alt="Logo" />
        <div style={{flex: "1"}}>
          <h1 className="logo" style={{ color:"#1c2c54", paddingTop:"45px", paddingLeft:"0px"}}>Health </h1>
          <h1 className="logo" style={{ color:"#f5853e", paddingLeft:"0px"}}>Journey</h1>
        </div>
      </div>
      <Divider style={{background:"#1c2c54"}}/>
      <div style={{margin:"10px"}}>
      <ComboBox
        options={Object.keys(le_bus_stops)}
        label={"Route"}
        handleRouteChange={handleRouteChange}
        value={route} 
        style={{ marginBottom: "10px !important" }}
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
              id_from = currStop['stopid']
            }
          }
          setToOptions(le_bus_stops[route]?.filter(stop => stop['stopid'] > id_from ) || []);
        }}
        style={{ marginBottom: "10px !important" }}
        value={from} 
      />
      <ComboBox
        disabled={!route}
        options={toOptions || []}
        label={"To"}
        style={{ marginBottom: "10px !important" }}
        handleRouteChange={(event, newInputValue) => {
          setTo(newInputValue);
        }}
        value={to} 
      />
      </div>
      <Button onClick={handleSubmit} type="primary" size="large" style={{ background: "#f5853e", borderColor: "#ffa061", marginLeft:"40%", marginTop:"10px", fontFamily: 'Exo'}}> Find! </Button>
      <div style={{ marginLeft: "auto", marginTop: "auto", marginBottom: "0px" }}>
          <img src={njcornerlogo} style={{paddingTop:"10px", maxHeight: '30px' }} alt="NJ Transit Corner Logo" />
        </div>
    </Card>
    </>
  );
}