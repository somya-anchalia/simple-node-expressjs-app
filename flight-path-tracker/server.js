// Importing the express module
const express = require('express');
// Creating an instance of an Express application
const app = express();
// Defining port for incoming HTTP requests.
const port = 8080;


app.use(express.json());

// Defining the function to calculate flight path
const calculateFlightPath = (flights) => {
    // Sample hardcoded flight path
    flightPath = ['DEL', 'LHR', 'JFK']
    return flightPath;
};

// Defining the calculate endpoint
app.post('/calculate', (request, response) => {

    // Parsing request body
    const all_flights = request.body.all_flights;

    // Validation of user input
    if (!Array.isArray(all_flights)) {
        return response.status(400).json({ error: 'Input format is invalid' });
    }

    // Function call to calculate flight path
    const flightPath = calculateFlightPath(all_flights);

    // Handling response 
    if (flightPath) {
        // Return only the start and end points
        response.json([flightPath[0], flightPath[flightPath.length-1]]);
    } else {
        response.status(400).json({ error: 'Unable to calculate the flight path' });
    }
    });

    // Starting the server and listening on the port 8080
    app.listen(port, () => {
    console.log(`Flight path tracker listening at http://localhost:${port}`);
});
  