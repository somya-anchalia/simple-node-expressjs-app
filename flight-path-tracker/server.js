// Importing the express module
const express = require("express");
// Creating an instance of an Express application
const app = express();
// Defining port for incoming HTTP requests.
const port = 8080;

// Adding middleware to express app for parsing incoming JSON requests
app.use(express.json());

// Function to calculate flight path
const calculateFlightPath = (all_flights) => {
  // Variable to store flight path
  const flightsPath = [];

  // Return null if there are no flights to process
  if (!all_flights.length) return null;

  // Maps to store flight pairs (Source->Destination) and (Destination->Source)
  const originalFlightMap = new Map();
  const reverseFlightMap = new Map();

  // Within the loop, each source-destination pair is added to flightMap, and each destination-source pair is added to reverseMap
  all_flights.forEach(([source, destination]) => {
    originalFlightMap.set(source, destination);
    reverseFlightMap.set(destination, source);
  });

  // Calculating the starting airport code of the flight path
  let startingAirport = null;
  for (const [source] of originalFlightMap) {
    if (!reverseFlightMap.has(source)) {
      startingAirport = source;
      break;
    }
  }

  // Sorting the flights and calculating the flights path
  let currentAirport = startingAirport;
  while (currentAirport) {
    flightsPath.push(currentAirport);
    currentAirport = originalFlightMap.get(currentAirport);
  }

  return flightsPath;
};

// Defining the calculate endpoint
app.post("/calculate", (request, response) => {
  // Parsing request body
  const all_flights = request.body.all_flights;

  // Validation of user input
  if (!Array.isArray(all_flights)) {
    return response.status(400).json({ error: "Input format is invalid" });
  }

  // Function call to calculate flight path
  const flightPath = calculateFlightPath(all_flights);

  // Handling response
  if (flightPath) {
    // Return only the start and end points
    response.json([flightPath[0], flightPath[flightPath.length - 1]]);
  } else {
    response.status(400).json({ error: "Unable to calculate the flight path" });
  }
});

// Starting the server and listening on the port 8080
app.listen(port, () => {
  console.log(`Flight path tracker listening at http://localhost:${port}`);
});
