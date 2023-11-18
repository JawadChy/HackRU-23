const express = require('express');
const app = express();
const cors = require("cors");
const fs = require('fs');
const axios = require('axios');


app.use(express.json()).use(cors({ origin:['http://localhost:5173']}));
require('dotenv').config();
let busStopsData = null;
let stopLocations = null;

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
            seenlabels = []
            for (const line of lines1) {
                const [lineId, routeId, direction, municipality, on, at,desc, stopId] = line.split(',');
                if (direction == 'Inbound' && !seenlabels.includes(desc)){
                    if (busStops[lineId]){
                        busStops[lineId].push({'stopid': stopId, 'label': desc, 'loc': stop_loc[stopId]});
                    }
                    else{
                        busStops[lineId] = [{'stopid': stopId, 'label': desc, 'loc': stop_loc[stopId]}];
                    }
                    seenlabels.push(desc)
                }
            }
            stopLocations = stop_loc;
            busStopsData = busStops;
            res.json(busStops);
        });
    });
});

app.post('/stops', (req, res) => {
  const { from, to } = req.body;
  res.json({ from, to });
});
app.get('/stops', (req, res) => {
  const { from, to } = req.query;
  const stopsData = findStopsBetween(from, to);
  res.json(stopsData);
});

app.get('/medical-places', async (req, res) => {
  const stop = req.query.stop;
  const radius = req.query.radius;
  const stopLocation = stopLocations[stop];
  console.log(radius)
  if (!stopLocation) {
    console.error(`Stop not found: ${stop}`);
    return res.status(404).json({ error: `Stop not found: ${stop}` });
  }
  const location = `${stopLocation.lat},${stopLocation.long}`;
  try {
      let params = {
          keyword: "medical facility",
          location: location, 
          radius: radius, 
          type: "hospital,urgent_care", 
          key: process.env.VITE_APP_GOOGLE_MAPS_API_KEY,
      };
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, { params });
        if (response.status === 200) {
            const medicalPlaces = response.data.results.map(place => ({
                name: place.name,
                address: place.vicinity,
                phone: 'Not available', 
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

function findStopsBetween(from, to) {
  for (const route in busStopsData) {
    const stops = busStopsData[route];
    const fromStop = stops.find(stop => stop.label === from);
    const toStop = stops.find(stop => stop.label === to);
    if (fromStop && toStop) {
      const fromIndex = stops.indexOf(fromStop);
      const toIndex = stops.indexOf(toStop);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        return stops.slice(fromIndex, toIndex + 1);
      }
    }
  }

  return [];
}
