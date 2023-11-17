const express = require('express');
const request = require('request');
const app = express();
const cors = require("cors");
const fs = require('fs');
const axios = require('axios');

var longitude = -33.8670522;
var latitude = 151.1957362;
var radius = 5000;

app.use(express.json()).use(cors({ origin:['http://localhost:5173']}));

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/bus_stops', (req, res) => {
    const busStops = {};
    const stop_loc = {};
    fs.readFile('./assets/Bus_Routes.txt', 'utf8', (err, stops) => {
        if (err) {
          console.error('Error reading the file:', err);
          return;
        }
        fs.readFile('./assets/bus_stops.txt', 'utf8', (err, loc) => {
            if (err) {
              console.error('Error reading the file:', err);
              return;
            }
            const lines = loc.split('\r\n');
            for (const line of lines) {
                const [id,stopId,stop_name,stop_desc,stop_lat,stop_lon,zone_id] = line.split(',');
                stop_loc[stopId] = {'lat': stop_lat, 'long': stop_lon};
            }
            
        
            lines1 = stops.split('\r\n');
            for (const line of lines1) {
                const [lineId, routeId, direction, municipality, on, at,desc, stopId] = line.split(',');
                if (direction == 'Inbound'){
                    if (busStops[lineId]){
                        busStops[lineId].push({'stopid': stopId, 'label': desc, 'loc': stop_loc[stopId]});
                    }
                    else{
                        busStops[lineId] = [{'stopid': stopId, 'label': desc, 'loc': stop_loc[stopId]}];
                    }
                }
            }
            res.json(busStops);
        });
    });
});

app.get("/results", (req, res) => {
    request.get({
        //need key here
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=clinic&location=${longitude}%2C${latitude}&radius=${radius}&type=doctor&key= `
      ,json: true
    })
    .pipe(res);
});

app.post('/submit-locations', (req, res) => {
    const { from, to } = req.body;

    console.log(`From: ${from}, To: ${to}`);

    // Do whatever you need with the locations...

    // Respond back to the client
    res.json({ message: 'Locations received!' });
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

app.get('/medical-places', async (req, res) => {
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
      res.json(medicalPlaces);
  
    } else {
      throw new Error(`Request failed with status code ${response.status}`);
    }
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

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

const apiKey = process.env.VITE_APP_GOOGLE_MAPS_API_KEY;
const baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const keyword = "medical facility";
const bus_stop = "40.980629,-74.120592";

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