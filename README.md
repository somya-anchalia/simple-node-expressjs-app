# javascript-programming-assignment-sse
Implemented a microservice that will expose an API endpoint /calculate that accepts flight records, sorts them, and returns the start and end destinations of the flight path.

# Flight Path Tracker

## Description

This microservice tracks a person's flight path by sorting through their flight records.

## API Endpoint

### POST /calculate

**Sample Request:**

- URL: `/calculate`
- Method: `POST`
- Content-Type: `application/json`
- Body: 
  ```json
  {
    "flights": [
      ["ATL", "EWR"],
      ["SFO", "ATL"]
    ]
  }


**Response:**

- Content-Type: application/json
- Body:
    ```json
     ["SFO", "EWR"]

**Running the Server**

1. Open terminal and navigate to project folder: ```cd flight-path-tracker/```

2. Install dependencies: ```npm install```

3. Start the server: ```node server.js```

4. The server will be running on http://localhost:8080

5. One a new terminal to run the test cases using following curl commands:
```
curl -X POST http://localhost:8080/calculate -H "Content-Type: application/json" -d '{"all_flights": [["SFO", "EWR"]]}'
```
```
curl -X POST http://localhost:8080/calculate -H "Content-Type: application/json" -d '{"all_flights": [["ATL", "EWR"], ["SFO", "ATL"]]}'
```
```
curl -X POST http://localhost:8080/calculate -H "Content-Type: application/json" -d '{"all_flights": [["IND", "EWR"], ["SFO", "ATL"], ["GSO", "IND"], ["ATL", "GSO"]]}'
```

**Interesting Ideas and Scalability**

- This service can be scaled horizontally by deploying it behind a load balancer.
- Frequently queried flight paths can be cached to improve performance.
- Authentication can be implemented to restrict access to the API.
- Improved error handling to provide more detailed messages.
