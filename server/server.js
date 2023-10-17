const express = require('express');
const request = require('request');
const app = express();
const cors = require("cors");
const fs = require('fs');

var longitude = -33.8670522;
var latitude = 151.1957362;
var radius = 10000;

app.use(express.json()).use(cors({ origin:['http://localhost:5173']}));
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
            
        
            const lines1 = stops.split('\r\n');
            for (const line of lines1) {
                const [lineId, routeId, direction, municipality, on, at,desc, stopId] = line.split(',');
                if (direction == 'Inbound'){
                    if (busStops[lineId]){
                        busStops[lineId][stopId] = {'name': desc, 'loc': stop_loc[stopId]};
                    }
                    else{
                        busStops[lineId] = {[stopId] : {'name': desc}}
                    }
                }
            }
            res.json(busStops);
        });
    });
});

app.get("/results", (req, res) => {
    request.get({
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=clinic&location=${longitude}%2C${latitude}&radius=${radius}&type=doctor&key=AIzaSyBDC9m9uuHLmvT6TgMf0eTuxjfvmanLXPU`,
      json: true
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

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
