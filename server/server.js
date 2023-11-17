const express = require('express');
const request = require('request');
const cors = require("cors");
const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(express.json()).use(cors({ origin:['http://localhost:5173']}));

let busStops = {};
let stopLocations = {};

function loadBusStopData() {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream('./assets/bus_stops.txt');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let isFirstLine = true; // To skip the header line

    rl.on('line', (line) => {
      if (isFirstLine) {
        isFirstLine = false;
        return;
      }

      const parts = line.split(',');
      const stopId = parts[0].trim();
      const lat = parseFloat(parts[4].trim());
      const long = parseFloat(parts[5].trim());

      stopLocations[stopId] = { lat, long };
    });

    rl.on('close', () => {
      console.log('Bus stop data loaded');
      resolve();
    });

    rl.on('error', (error) => {
      console.error('Error reading bus stop data file:', error);
      reject(error);
    });
  });
}


function loadBusRoutesData() {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream('./assets/Bus_Routes.txt');

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      const stops = line.split(',');
      const routeId = stops.shift(); // Remove the first element as the route ID
      busStops[routeId] = stops;
    });

    rl.on('close', () => {
      console.log('Bus routes data loaded');
      resolve();
    });

    rl.on('error', (error) => {
      console.error('Error reading bus routes data file:', error);
      reject(error);
    });
  });
}

function findStopsBetween(from, to) {
  // Assuming from and to are stop IDs
  for (const route in busStops) {
      const stops = busStops[route];
      const fromIndex = stops.indexOf(from);
      const toIndex = stops.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
          return stops.slice(fromIndex, toIndex + 1);
      }
  }
  return []; // Return an empty array if no route is found
}


app.get('/medical-places', async (req, res) => {
  const stop = req.query.stop;
  console.log("Requested stop:", stop); // Log the requested stop
  console.log("Available stops:", Object.keys(stopLocations)); // Log available stops

    // Use the stop ID to find the location
    const stopLocation = stopLocations[stop];
    if (!stopLocation) {
      console.error(`Stop not found: ${stop}`);
      return res.status(404).json({ error: `Stop not found: ${stop}` });
    }

    const location = `${stopLocation.lat},${stopLocation.long}`;

    try {
        const params = {
            keyword: "medical facility",
            location: location, 
            radius: 1000, 
            type: "hospital,urgent_care", 
            key: process.env.VITE_APP_GOOGLE_MAPS_API_KEY,
        };

        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, { params });
        console.log("Google Maps API Key:", process.env.VITE_APP_GOOGLE_MAPS_API_KEY);


        if (response.status === 200) {
            const medicalPlaces = response.data.results.map(place => ({
                name: place.name,
                address: place.vicinity,
                phone: 'Not available', // Replace with actual data if available
                stars: place.rating || 'Not rated',
            }));

            res.json(medicalPlaces);
        } else {
            throw new Error(`Request failed with status code ${response.status}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).json({ error: "An error occurred while fetching data." });
    }
});

app.get('/bus_stops', (req, res) => {
  res.json(busStops);
});

app.get('/autocomplete/:searchQuery', async (req, res) => {
    const { searchQuery } = req.params;

    try {
        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(searchQuery)}&limit=7&apiKey=${process.env.VITE_APP_GEOAPIFY_API_KEY}`
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});

app.post('/submit-locations', (req, res) => {
  const { from, to } = req.body;
  // Implement your logic here
  // For now, just sending back the received data
  res.json({ from, to });
});

app.get('/stops', (req, res) => {
  const { from, to } = req.query;
  const stops = findStopsBetween(from, to);
  res.json(stops);
});

const apiKey = process.env.VITE_APP_GOOGLE_MAPS_API_KEY;
const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const keyword = "medical facility";
const bus_stop = "40.980629,-74.120592"; // Update this with nearest bus once location is recieved from front end

/*app.get('/medical-places', async (req, res) => {
  try {
    const params = {
      keyword: keyword,
      location: bus_stop, 
      radius: 1000, 
      type: "hospital,urgent_care", 
      key: apiKey,
    };

    const response = await axios.get(baseUrl, { params });

    if (response.status === 200) {
      const data = response.data;
      const medicalPlaces = [];

      for (const place of data.results) {
        const name = place.name;
        const address = place.vicinity;
        const location = place.geometry.location;
        const lat = location.lat;
        const lng = location.lng;
        const medicalFacitCoord = { lat, lng };
        const distance = getDistance(bus_stop, medicalFacitCoord);

        const placeInfo = {
          name: name,
          address: address,
          lat: lat,
          lng: lng,
          distance: distance,
        };

        medicalPlaces.push(placeInfo);
       
      }

      const medicalPlacesJson = { Results: medicalPlaces };
      console.log(medicalPlacesJson)
      res.json(medicalPlaces);
  
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});
*/
function getDistance(coord1, coord2) {
  const rad = Math.PI / 180;
  const lat1 = coord1.split(',')[0] * rad;
  const lat2 = coord2.lat * rad;
  const lon1 = coord1.split(',')[1] * rad;
  const lon2 = coord2.lng * rad;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a =
    Math.sin(dlat / 2) * Math.sin(dlat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = 6371 * c;

  return distance;
}

Promise.all([loadBusStopData(), loadBusRoutesData()])
  .then(() => {
    const PORT = 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to load data:', error);
  });