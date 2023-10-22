import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from 'axios'
import ComboBox from "./components/ComboBox";


function App() {
  const [route, setRoute] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [bus_stops, setStop] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get('http://localhost:3000/bus_stops')
      .then((response) => {
        console.log(response.data);
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

    // Construct the payload
    const payload = {
      from: from,
      to: to,
    };

    // Send a POST request to your server
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

  // const bus_stops = {
  //   508: [
  //     { id: 1, label: "ACROSS ATLANTIC AVE AT OHIO AVE" },
  //     { id: 2, label: "ALBANY AVE AT CROSSAN AVE" },
  //     { id: 3, label: "ALBANY AVE AT FILBERT AVE" },
  //     { id: 4, label: "ATLANTIC AVE AT ARKANSAS AVE" },
  //     { id: 5, label: "ATLANTIC AVE AT BOSTON AVE" },
  //     { id: 6, label: "ATLANTIC AVE AT BRIGHTON AVE" },
  //     { id: 7, label: "ATLANTIC AVE AT CALIFORNIA AVE" },
  //     { id: 8, label: "ATLANTIC AVE AT CHELSEA AVE" },
  //     { id: 9, label: "ATLANTIC AVE AT FLORIDA AVE" },
  //     { id: 10, label: "ATLANTIC AVE AT KENTUCKY AVE" },
  //     { id: 11, label: "ATLANTIC AVE AT MARTIN LUTHER KING BLVD" },
  //     { id: 12, label: "ATLANTIC AVE AT MISSISSIPPI AVE" },
  //     { id: 13, label: "ATLANTIC AVE AT MONTPELIER AVE" },
  //     { id: 14, label: "ATLANTIC AVE AT NEW YORK AVE" },
  //     { id: 15, label: "ATLANTIC CARE ACCESS RD AT HACKBERRY LANE" },
  //     { id: 16, label: "ATLANTIC COUNTY - SOCIAL SECURITY OFFICE" },
  //     { id: 17, label: "ATLANTICARE REGIONAL MEDICAL CENTER" },
  //     { id: 18, label: "CALIFORNIA AVE AT FALCON DR" },
  //     { id: 19, label: "CALIFORNIA AVE AT NEW RD" },
  //     { id: 20, label: "COLLINS RD AT FEDERAL CT" },
  //     { id: 21, label: "COLLINS RD AT GREENWICH DR. EAST" },
  //     { id: 22, label: "FIRE RD AT CALIFORNIA AVE. (2511 FIRE)#" },
  //     { id: 23, label: "HAMILTON MALL" },
  //     { id: 24, label: "JIMMIE LEEDS RD AT ASH AVE" },
  //     { id: 25, label: "JIMMIE LEEDS RD AT PITNEY RD" },
  //     { id: 26, label: "JIMMIE LEEDS RD AT PITNEY RD#" },
  //     { id: 27, label: "JIMMIE LEEDS RD AT SEASHORE GARDENS ENTRANCE" },
  //     { id: 28, label: "JIMMIE LEEDS RD AT SEAVIEW AVE" },
  //     { id: 29, label: "MAIN ST AT ADAMS AVE" },
  //     { id: 30, label: "MAIN ST AT BRIGHTON AVE" },
  //     { id: 31, label: "MAIN ST AT CEDARCREST AVE" },
  //     { id: 32, label: "MAIN ST AT DELILAH RD" },
  //     { id: 33, label: "MAIN ST AT LEEDS AVE" },
  //     { id: 34, label: "MAIN ST AT MULBERRY AVE" },
  //     { id: 35, label: "MAIN ST AT PLEASANT AVE" },
  //     { id: 36, label: "MAIN ST AT READING AVE" },
  //     { id: 37, label: "MAIN ST AT REDWOOD AVE" },
  //     { id: 38, label: "MAIN ST AT STENTON PL" },
  //     { id: 39, label: "MAIN ST AT THOMPSON AVE" },
  //     { id: 40, label: "MAIN ST AT WOODLAND AVE" },
  //     { id: 41, label: "NEW RD AT DELAWARE AVE" },
  //     { id: 42, label: "NEW RD AT MEADOWVIEW AVE" },
  //     { id: 43, label: "NEW RD AT NEW JERSEY AVE" },
  //     { id: 44, label: "NEW RD AT OHIO AVE" },
  //     { id: 45, label: "PITNEY RD AT SPENCER LN" },
  //     { id: 46, label: "POMONA RD AT DUERER ST#" },
  //     { id: 47, label: "POMONA RD AT JIMMY LEEDS RD" },
  //     { id: 48, label: "POMONA RD AT WHITE HORSE PIKE" },
  //     { id: 49, label: "PORTER AVE AT ALBANY AVE" },
  //     { id: 50, label: "PREFERRED CARE AT ABSECON" },
  //     { id: 51, label: "RT-40/322 AT CORDOVA AVE#" },
  //     { id: 52, label: "RT-40/322 AT DRESDEN PL" },
  //     { id: 53, label: "RT-40/322 AT EAST PLAZA PL#" },
  //     { id: 54, label: "RT-40/322 AT FOX PL" },
  //     { id: 55, label: "RT-40/322 AT GRANADA AVE" },
  //     { id: 56, label: "RT-40/322 AT LYONS COURT" },
  //     { id: 57, label: "RT-40/322 AT NAPLES AVE#" },
  //     { id: 58, label: "RT-40/322 AT PALERMO AVE#" },
  //     { id: 59, label: "RT-40/322 AT PARIS PL#" },
  //     { id: 60, label: "RT-40/322 AT RODEWAY INN MOTEL#" },
  //     { id: 61, label: "RT-40/322 AT TOULON AVE#" },
  //     { id: 62, label: "RT-9 AT OCEAN AVE" },
  //     { id: 63, label: "S CAROLINA AVE AT ATLANTIC AVE" },
  //     { id: 64, label: "SHORE RD AT BAYVIEW DR" },
  //     { id: 65, label: "STOCKTON UNIVERSITY" },
  //     { id: 66, label: "US-9 AT CORDERY AVE#" },
  //     { id: 67, label: "US-9 AT SHARSWOOD AVE" },
  //     { id: 68, label: "W JERSEY AVE AT MAIN ST" },
  //     { id: 69, label: "WRANGLEBORO RD AT ALEXANDER DR#" },
  //     { id: 70, label: "WRANGLEBORO RD AT COLLINS RD" },
  //     { id: 71, label: "WRANGLEBORO RD AT GREAT CREEK RD" },
  //     { id: 72, label: "WRANGLEBORO RD AT PEARCE RD#" },
  //     { id: 73, label: "WRANGLEBORO RD AT TIMBER GLEN DR CONSUMER SQUARE" },
  //     { id: 74, label: "WRANGLEBORO RD AT WALDEN WAY" },
  //     { id: 75, label: "WYOMING AVE AT BAYVIEW DR" },
  //     { id: 76, label: "WYOMING AVE AT PITNEY RD" },
  //   ],
  // };
  
  return (
    <div className="App">
      <h1>Health Journey</h1>
      <ComboBox
        options={[{ label: "508" }]}
        label={"Route"}
        handleRouteChange={handleRouteChange}
      />
      <ComboBox
        disabled={!route}
        options={bus_stops[route] || []}
        label={"From"}
        handleRouteChange={(event, newInputValue) => {
          setFrom(newInputValue);
        }}
      />
      <ComboBox
        disabled={!route}
        options={bus_stops[route] || []}
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

export default App;
