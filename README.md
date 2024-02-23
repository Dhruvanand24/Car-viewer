Carview API Documentation
Base URL
All endpoints are relative to http://localhost:3000.
Authentication
All requests requiring authentication should include an Authorization header with a valid JWT token.
1. User Signup
Endpoint: POST /usersignup
Description: Register a new user.
Request Body:
json

{
  "user_email": "user@example.com",
  "user_location": "City, Country",
  "password": "user_password"
}
Responses:
201 Created: User registered successfully.
301 Moved Permanently: User already exists.
500 Internal Server Error: Failed to register user.
2. Dealership Signup
Endpoint: POST /dealershipsignup
Description: Register a new dealership.
Request Body:
json

{
  "dealership_email": "dealer@example.com",
  "dealership_location": "City, Country",
  "dealership_name": "Dealer Name",
  "password": "dealer_password"
}
Responses:
201 Created: Dealership registered successfully.
301 Moved Permanently: Dealership already exists.
500 Internal Server Error: Failed to register dealership.
3. User Login
Endpoint: POST /userlogin
Description: User login.
Request Body:
json

{
  "user_email": "user@example.com",
  "password": "user_password"
}
Responses:
200 OK: Login successful. Response includes user details and JWT token.
401 Unauthorized: Invalid credentials.
500 Internal Server Error: Internal server error.
4. Dealership Login
Endpoint: POST /dealerlogin
Description: Dealership login.
Request Body:
json

{
  "dealership_email": "dealer@example.com",
  "password": "dealer_password"
}
Responses:
200 OK: Login successful. Response includes dealership details and JWT token.
401 Unauthorized: Invalid credentials.
500 Internal Server Error: Internal server error.
5. Forgot Password - User
Endpoint: POST /changeuserpassword
Description: Change user password.
Request Body:
json

{
  "user_email": "user@example.com",
  "password": "new_password"
}
Responses:
200 OK: Password changed successfully.
500 Internal Server Error: Failed to change password.
6. Forgot Password - Dealership
Endpoint: POST /changedealerpassword
Description: Change dealership password.
Request Body:
json

{
  "dealership_email": "dealer@example.com",
  "password": "new_password"
}
Responses:
200 OK: Password changed successfully.
500 Internal Server Error: Failed to change password.
7. Logout
Endpoint: POST /logout
Description: Logout the user or dealership.
Request Headers:
Authorization: JWT token.
Responses:
200 OK: Logout successful.
403 Forbidden: Token not provided.
401 Unauthorized: Token invalidated.
8. My Vehicles - User
Endpoint: POST /myvehicles
Description: Get vehicles owned by a user.
Request Body:
json
{
  "user_id": "user_id_here"
}
Responses:
200 OK: List of user's vehicles.
404 Not Found: User not found.
500 Internal Server Error: Internal server error.
9. My Sold Vehicles - Dealership
Endpoint: POST /mysoldvehicles
Description: Get sold vehicles by a dealership.
Request Body:
json

{
  "dealership_id": "dealership_id_here"
}
Responses:
200 OK: List of dealership's sold vehicles.
404 Not Found: Dealership not found.
500 Internal Server Error: Internal server error.
10. View All Cars Deals
Endpoint: GET /cars
Description: Get details of all car deals.
Responses:
200 OK: List of car deals.
500 Internal Server Error: Internal server error.
11. Get Car Details by Car ID
Endpoint: POST /getcardetails
Description: Get details of a specific car by its ID.
Request Body:
json

{
  "car_id": "car_id_here"
}
Responses:
200 OK: Car details.
404 Not Found: Car details not found.
500 Internal Server Error: Internal server error.
12. View Dealership's Cars
Endpoint: POST /dealershipcars
Description: Get details of all cars owned by a dealership.
Request Body:
json

{
  "dealership_id": "dealership_id_here"
}
Responses:
200 OK: List of dealership's cars.
404 Not Found: Dealership not found.
500 Internal Server Error: Internal server error.
13. View All Deals for User
Endpoint: GET /alldeals
Description: Get details of all deals available for users.
Responses:
200 OK: List of all deals.
500 Internal Server Error: Internal server error.
14. View All Deals for Dealership
Endpoint: POST /alldealershipdeals
Description: Get details of all deals available for a dealership.
Request Body:
json

{
  "dealership_id": "dealership_id_here"
}
Responses:
200 OK: List of dealership's deals.
404 Not Found: Dealership not found.
500 Internal Server Error: Internal server error.
15. Dealership Adds Car
Endpoint: POST /addcars
Description: Dealership adds a new car.
Request Body:
json

{
  "type": "Car Type",
  "name": "Car Name",
  "model": "Car Model",
  "car_info": "Additional Car Information",
  "dealership_id": "dealership_id_here"
}
Responses:
200 OK: Car added successfully.
500 Internal Server Error: Internal server error.
16. Dealership Updates Car
Endpoint: POST /updatecars
Description: Dealership updates car details.
Request Body:
json

{
  "type": "Car Type",
  "name": "Updated Car Name",
  "model": "Updated Car Model",
  "car_info": "Updated Additional Car Information",
  "car_id": "car_id_here"
}
Responses:
200 OK: Car updated successfully.
404 Not Found: Car not found.
500 Internal Server Error: Internal server error.
17. Dealership Adds Deal
Endpoint: POST /adddeals
Description: Dealership adds a new deal.
Request Body:
json

{
  "car_id": "car_id_here",
  "deal_info": { "price": 50000, "traveled": 100, "dealership_id": "dealership_id_here" },
  "dealership_id": "dealership_id_here"
}
Responses:
200 OK: Deal added successfully.
500 Internal Server Error: Internal server error.
18. View All Dealerships
Endpoint: GET /alldealerships
Description: Get details of all registered dealerships.
Responses:
200 OK: List of all dealerships.
500 Internal Server Error: Internal server error.
19. Buy Now Button
Endpoint: POST /addsoldvehicle
Description: Process a vehicle purchase.
Request Body:
json

{
  "car_id": "car_id_here",
  "vehicle_info": "Additional Vehicle Information",
  "dealership_id": "dealership_id_here",
  "user_id": "user_id_here"
}
Responses:
200 OK: Vehicle added to sold vehicles.
500 Internal Server Error: Internal server error.
20. Sold Vehicles Data
Endpoint: POST /soldvehiclesdata
Description: Get details of a sold vehicle.
Request Body:
json

{
  "vehicle_id": "vehicle_id_here"
}
Responses:
200 OK: Details of the sold vehicle.
404 Not Found: Sold vehicle not found.
500 Internal Server Error: Internal server error.
