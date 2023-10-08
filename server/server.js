const express = require('express');
const request = require('request');
const app = express();
const cors = require("cors");
const bus_stops= {"508":{
    "1": "ACROSS ATLANTIC AVE AT OHIO AVE",
    "2": "ALBANY AVE AT CROSSAN AVE",
    "3": "ALBANY AVE AT FILBERT AVE",
    "4": "ATLANTIC AVE AT ARKANSAS AVE",
    "5": "ATLANTIC AVE AT BOSTON AVE",
    "6": "ATLANTIC AVE AT BRIGHTON AVE",
    "7": "ATLANTIC AVE AT CALIFORNIA AVE",
    "8": "ATLANTIC AVE AT CHELSEA AVE",
    "9": "ATLANTIC AVE AT FLORIDA AVE",
    "10": "ATLANTIC AVE AT KENTUCKY AVE",
    "11": "ATLANTIC AVE AT MARTIN LUTHER KING BLVD",
    "12": "ATLANTIC AVE AT MISSISSIPPI AVE",
    "13": "ATLANTIC AVE AT MONTPELIER AVE",
    "14": "ATLANTIC AVE AT NEW YORK AVE",
    "15": "ATLANTIC CARE ACCESS RD AT HACKBERRY LANE",
    "16": "ATLANTIC COUNTY - SOCIAL SECURITY OFFICE",
    "17": "ATLANTICARE REGIONAL MEDICAL CENTER",
    "18": "CALIFORNIA AVE AT FALCON DR",
    "19": "CALIFORNIA AVE AT NEW RD",
    "20": "COLLINS RD AT FEDERAL CT",
    "21": "COLLINS RD AT GREENWICH DR. EAST",
    "22": "FIRE RD AT CALIFORNIA AVE. (2511 FIRE)#",
    "23": "HAMILTON MALL",
    "24": "JIMMIE LEEDS RD AT ASH AVE",
    "25": "JIMMIE LEEDS RD AT PITNEY RD",
    "26": "JIMMIE LEEDS RD AT PITNEY RD#",
    "27": "JIMMIE LEEDS RD AT SEASHORE GARDENS ENTRANCE",
    "28": "JIMMIE LEEDS RD AT SEAVIEW AVE",
    "29": "MAIN ST AT ADAMS AVE",
    "30": "MAIN ST AT BRIGHTON AVE",
    "31": "MAIN ST AT CEDARCREST AVE",
    "32": "MAIN ST AT DELILAH RD",
    "33": "MAIN ST AT LEEDS AVE",
    "34": "MAIN ST AT MULBERRY AVE",
    "35": "MAIN ST AT PLEASANT AVE",
    "36": "MAIN ST AT READING AVE",
    "37": "MAIN ST AT REDWOOD AVE",
    "38": "MAIN ST AT STENTON PL",
    "39": "MAIN ST AT THOMPSON AVE",
    "40": "MAIN ST AT WOODLAND AVE",
    "41": "NEW RD AT DELAWARE AVE",
    "42": "NEW RD AT MEADOWVIEW AVE",
    "43": "NEW RD AT NEW JERSEY AVE",
    "44": "NEW RD AT OHIO AVE",
    "45": "PITNEY RD AT SPENCER LN",
    "46": "POMONA RD AT DUERER ST#",
    "47": "POMONA RD AT JIMMY LEEDS RD",
    "48": "POMONA RD AT WHITE HORSE PIKE",
    "49": "PORTER AVE AT ALBANY AVE",
    "50": "PREFERRED CARE AT ABSECON",
    "51": "RT-40/322 AT CORDOVA AVE#",
    "52": "RT-40/322 AT DRESDEN PL",
    "53": "RT-40/322 AT EAST PLAZA PL#",
    "54": "RT-40/322 AT FOX PL",
    "55": "RT-40/322 AT GRANADA AVE",
    "56": "RT-40/322 AT LYONS COURT",
    "57": "RT-40/322 AT NAPLES AVE#",
    "58": "RT-40/322 AT PALERMO AVE#",
    "59": "RT-40/322 AT PARIS PL#",
    "60": "RT-40/322 AT RODEWAY INN MOTEL#",
    "61": "RT-40/322 AT TOULON AVE#",
    "62": "RT-9 AT OCEAN AVE",
    "63": "S CAROLINA AVE AT ATLANTIC AVE",
    "64": "SHORE RD AT BAYVIEW DR",
    "65": "STOCKTON UNIVERSITY",
    "66": "US-9 AT CORDERY AVE#",
    "67": "US-9 AT SHARSWOOD AVE",
    "68": "W JERSEY AVE AT MAIN ST",
    "69": "WRANGLEBORO RD AT ALEXANDER DR#",
    "70": "WRANGLEBORO RD AT COLLINS RD",
    "71": "WRANGLEBORO RD AT GREAT CREEK RD",
    "72": "WRANGLEBORO RD AT PEARCE RD#",
    "73": "WRANGLEBORO RD AT TIMBER GLEN DR CONSUMER SQUARE",
    "74": "WRANGLEBORO RD AT WALDEN WAY",
    "75": "WYOMING AVE AT BAYVIEW DR",
    "76": "WYOMING AVE AT PITNEY RD"
 }

};

json = JSON.stringify(bus_stops);
// const response = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [{"role": "system", "content": "You are a helpful assistant."},
//         {"role": "user", "content": "Who won the world series in 2020?"},
//         {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
//         {"role": "user", "content": "Where was it played?"}],
// });
// const responseMessage = response.choices[0].message;
// console.log(responseMessage);
app.get("/",(req,res)=>{
    res.send(json)
})

var longitude = -33.8670522;
var latitude = 151.1957362;
var radius = 10000;

app
    .use(express.json())
    .use(cors({ origin: ['http://localhost:5173'] }));

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

// Assuming you have some port number defined, e.g., 3000
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
