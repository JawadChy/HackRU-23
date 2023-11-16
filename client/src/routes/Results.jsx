import { useState } from "react";
import "../assets/Results.css"
import Lining from "../components/steps";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
export default function Resultspage(){

    const [selectedRoute, setSelectedRoute] = useState('S CAROLINA AVE AT ATLANTIC AVE');
    const l_stops = [
    {
      title: "S CAROLINA AVE AT ATLANTIC AVE",
    },
    {
      title: "ATLANTIC AVE AT NEW YORK AVE",
    },
    {
      title: "ATLANTIC AVE AT KENTUCKY AVE",
    },
    {
        title: "ATLANTIC AVE AT MARTIN LUTHER KING BLVD",
      },
  ];
  const handleStepClick = (clickedTitle) => {
    setSelectedRoute(clickedTitle)
  };
    const facilitiesData = {
        'S CAROLINA AVE AT ATLANTIC AVE': [
            {
                name: 'AtlantiCare Urgent Care Atlantic City',
                address: '3830 Atlantic Ave, Atlantic City, NJ 08401',
                phone: 'Not provided',
                stars: '2.8/5'
            },
            {
                name: 'HealthMed Urgent Care - Atlantic City',
                address: '24 S South Carolina Ave, Atlantic City, NJ 08401',
                phone: '+16093458000',
                stars: 3.9/5
            },
            {
                name: 'Atlanticare Health System',
                address: '14 S Ohio Ave, Atlantic City, NJ 08401',
                phone: 'Not provided',
                stars: '4.7/5'
            }

        ],
        'ATLANTIC AVE AT NEW YORK AVE': [
            {
                name: 'Southern Jersey Family Medical Centers',
                address: '1125 Atlantic Ave, Atlantic City, NJ 08401',
                phone: '+18004860131',
                stars: '1.6/5'
            },
            {
                name: 'Atlantic Primary Care PC',
                address: '72 W Jimmie Leeds Rd, Galloway, NJ 08205',
                phone: '+16096521115',
                stars: '5/5'
                
            }
        ],
        'ATLANTIC AVE AT KENTUCKY AVE': [
           
            {
                name: 'The Caesar\'s Health Center',
                address: '2015 Pacific Ave, Atlantic City, NJ 08401',
                phone: '+16093401633',
                stars: 'Not Provided'
            },{
                name: 'Act On Total Health - Atlantic City Family Medicine',
                address: '1325 Baltic Ave, Atlantic City, NJ 08401',
                phone: '+16097107100',
                stars: '4.8/5'
            },{
                name: 'FQHC Family Medicine Residency Clinic',
                address: '7 S Ohio Ave FL 2, Atlantic City, NJ 08401',
                phone: '+16095728800',
                stars: '4.5/5'
            },
        ],
        'ATLANTIC AVE AT MARTIN LUTHER KING BLVD': [
            {
                name: 'Healthcare Njr',
                address: '1925 Pacific Ave, Atlantic City, NJ 08401',
                phone: '+16094418976',
                stars: '2.3/5'
            },
            {
                name: 'AtlanticCare Behavioral Health',
                address: '1616 Pacific Ave, Atlantic City, NJ 08401',
                phone: '+16094987220',
                stars: '1/5'
            },
            {
                name: 'UNITE HERE HEALTH - Health Center',
                address: '1801 Atlantic Ave 3rd floor, Atlantic City, NJ 08401',
                phone: '+16095702400',
                stars: '4.6/5'
            }
        ]
    };
    const currentFacilities = facilitiesData[selectedRoute] || [];

    return (
      <div style={{ background: "#E0E0E0", padding: "20px" }}>
    <div style={{ display: "flex"}}>
      <h1 style={{ flex: "1"}}>Route 508</h1>
      <h1 style={{ flex: "1" }}>Medical Facilities</h1>
    </div>
    <div style={{ display: "flex", height: "100%" }}>
      <div className="place" style={{ flex: "1", height: "100px", marginRight: "20px" }}>
        <Lining stops={l_stops} onStepClick={handleStepClick} style={{ height: "100px" }} />
      </div>
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          position: "sticky",
          top: "0",
          width: "45%", // Adjust the width if necessary
          marginLeft: "20px", // Adjust the margin if necessary
          marginTop: "30px", // Adjust the margin if necessary
        }}
      >
        {currentFacilities.map((facility, index) => (
          <div key={index} className="place">
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
