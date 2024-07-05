// Importing the express module
const express = require("express");
// Creating an instance of an Express application
const app = express();
// Defining port for incoming HTTP requests.
const port = 8080;

// Adding middleware to express app for parsing incoming JSON requests
app.use(express.json());

// Modules to write logs to local file
const fs = require('fs');
const path = require('path');

// File path for storing logs
const logFilePath = path.join(__dirname, 'logs.log');

// Function to store logs in a separate file
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} - ${message}\n`;
  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
}

// Function to calculate flight path
const calculateFlightPath = (allFlights) => {
  // Variable to store flight path
  const flightsPath = [];

  // Return null if there are no flights to process
  if (!allFlights.length) return null;

  // Maps to store flight pairs (Source->Destination) and (Destination->Source)
  const originalFlightMap = new Map();
  const reverseFlightMap = new Map();

  // Within the loop, each source-destination pair is added to flightMap, and each destination-source pair is added to reverseMap
  allFlights.forEach(([source, destination]) => {
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
  logMessage("Starting airport : " + startingAirport);

  // Sorting the flights and calculating the flights path
  let currentAirport = startingAirport;
  while (currentAirport) {
    flightsPath.push(currentAirport);
    currentAirport = originalFlightMap.get(currentAirport);
  }

  // Logging the full flight path
  logMessage("Flights Path : "+ flightsPath.toString());
  return flightsPath;
};

// Defining the calculate endpoint
app.post("/calculate", (request, response) => {
  // Parsing request body
  const allFlights = request.body.all_flights;

  // Validation of user input
  if (!Array.isArray(allFlights)) {
    return response.status(400).json({ error: "Input format is invalid" });
  }

  // Function call to calculate flight path
  const flightPath = calculateFlightPath(allFlights);

  // Handling response
  if (flightPath) {
    // Return only the start and end points
    const startEndAirports = [flightPath[0], flightPath[flightPath.length - 1]]

    // Logging the starting and ending airport codes
    logMessage("Boarding and Destination airport codes: "+ startEndAirports.toString());

    response.json(startEndAirports);
  } else {
    response.status(400).json({ error: "Unable to calculate the flight path" });
  }
});

// Starting the server and listening on the port 8080
app.listen(port, () => {
  logMessage(` ============ Flight path tracker listening at http://localhost:${port} =========`);
  console.log(` ============ Flight path tracker listening at http://localhost:${port} =========`);
});
