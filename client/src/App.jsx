import { useState } from 'react';
import './App.css';

function App() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission behavior
    
    // Construct the payload
    const payload = {
      from: fromLocation,
      to: toLocation
    };
  
    // Send a POST request to your server
    try {
      const response = await fetch('/submit-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);  // Handle the server's response as needed
  
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="App">
      <h1>HealthJourney</h1>
      <input
        type="text"
        placeholder="From Location"
        value={fromLocation}
        onChange={e => setFromLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Location"
        value={toLocation}
        onChange={e => setToLocation(e.target.value)}
      />
      <button type="submit" onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
