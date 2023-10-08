const express = require('express');
const request = require('request');
const app = express();

var longitude = -33.8670522;
var latitude = 151.1957362;
var radius = 15000;


app.use(express.json());

app.get("/getdata", (req, res) => {
    request.get({
      url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=clinic&location=${longitude}%2C${latitude}&radius=${radius}&type=doctor&key=AIzaSyBDC9m9uuHLmvT6TgMf0eTuxjfvmanLXPU`,
      json: true
    })
    .pipe(res);
});



// axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=clinic&location=${longitude}%2C${latitude}&radius=${radius}&type=doctor&key=AIzaSyBDC9m9uuHLmvT6TgMf0eTuxjfvmanLXPU`)
//     .then((response) => {
//         places = response.data;
//         console.log(places); // This logs the value of places once it's set.
//     })
//     .catch((error) => {
//         console.log(error);
//     });

// // Middleware to check if places data is loaded
// function ensurePlacesLoaded(req, res, next) {
//     if (places) {
//         next();
//     } else {
//         res.status(503).json({ error: 'Data not loaded yet. Try again later.' });
//     }
// }

// // Endpoint to send places data as JSON
// app.get('/places', ensurePlacesLoaded, (req, res) => {
//     res.json(places);
// });

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

// Assuming you have some port number defined, e.g., 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
