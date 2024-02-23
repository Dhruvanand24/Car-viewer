// index.js
import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// Get environment variables
const { PORT = 3000, MONGODB_URI, JWT_SECRET } = process.env;

// Initialize Express
const app = express();
app.use(cors());

// Use middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection
const client = new MongoClient(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

connectToMongoDB();

// JWT token creation function
const createToken = (data) => jwt.sign(data, JWT_SECRET, { expiresIn: "1h" });

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "Token not provided" });
  }

  if (blacklist.includes(token)) {
    return res.status(401).json({ error: "Token invalidated" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Failed to authenticate token" });
    }
    req.user = decoded;
    next();
  });
};

// Token blacklist
const blacklist = [];

// Sample route for testing
app.get("/", (req, res) => {
  res.send("Hello, this is your backend!");
});
app.get("/check", async (req, res) => {
  try {
    const users = await client
      .db("Carview")
      .collection("user")
      .find()
      .toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// User authentication endpoint

//user signup
app.post("/usersignup", async (req, res) => {
  const { user_email, user_location, password } = req.body;
  console.log(user_email, user_location, password);
  const hashpassword = await bcrypt.hash(password, 10);

  const finaldata = {
    user_email: user_email,
    password: hashpassword,
    user_location: user_location,
    vehicle_info: [],
  };
  try {
    const exist = await client
      .db("Carview")
      .collection("user")
      .findOne({ user_email });
    console.log(exist);

    if (exist) {
      return res.status(301).json({ error: "User already exists" });
    }

    const result = await client
      .db("Carview")
      .collection("user")
      .insertOne(finaldata);

    if (result.acknowledged === true) {
      return res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(500).json({ error: "Failed to register user" });
    }
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//dealer signup
app.post("/dealershipsignup", async (req, res) => {
  const { dealership_email, dealership_location, dealership_name, password } =
    req.body;
  const hashpassword = await bcrypt.hash(password, 10);
  console.log(hashpassword);

  const finaldata = {
    dealership_email: dealership_email,
    password: hashpassword,
    dealership_location: dealership_location,
    dealership_name: dealership_name,
    cars: [],
    deals: [],
    sold_vehicles: [],
  };

  try {
    const exist = await client
      .db("Carview")
      .collection("dealership")
      .findOne({ dealership_email });

    if (exist) {
      return res.status(301).json({ error: "Dealership already exists" });
    }

    const result = await client
      .db("Carview")
      .collection("dealership")
      .insertOne(finaldata);
    console.log(result);

    if (result.acknowledged === true) {
      return res
        .status(201)
        .json({ message: "Dealership registered successfully" });
    } else {
      return res.status(500).json({ error: "Failed to register dealership" });
    }
  } catch (error) {
    console.error("Error during dealership signup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//user login
app.post("/userlogin", async (req, res) => {
  const { user_email, password } = req.body;
  console.log(user_email, password);

  try {
    const user = await client
      .db("Carview")
      .collection("user")
      .findOne({ user_email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken({ user_id: user._id, user_email });

    res.json({
      user_id: user._id,
      user_email,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//dealer login
app.post("/dealerlogin", async (req, res) => {
  const { dealership_email, password } = req.body;
  console.log(dealership_email, password);

  try {
    const user = await client
      .db("Carview")
      .collection("dealership")
      .findOne({ dealership_email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken({ user_id: user._id, dealership_email });

    // Include user email, user ID, and token in the response
    res.json({
      dealership_id: user._id,
      dealership_email,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//forgot password for user
app.post("/changeuserpassword", async (req, res) => {
  try {
    const { user_email, password } = req.body;
    

    // Hash the new password
    const hashpassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const result = await client
      .db("Carview")
      .collection("user")
      .updateOne(
        { user_email: user_email },
        { $set: { password: hashpassword } }
      );

    if (result.acknowledged === true) {
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(500).json({ error: "Failed to change password" });
    }
  } catch (error) {
    console.error("Error during password change:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//forgot password for dealer
app.post("/changedealerpassword", async (req, res) => {
  try {
    const { dealership_email, password } = req.body;
    

    // Hash the new password
    const hashpassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    const result = await client
      .db("Carview")
      .collection("dealership")
      .updateOne(
        { dealership_email: dealership_email },
        { $set: { password: hashpassword } }
      );

    if (result.acknowledged === true) {
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(500).json({ error: "Failed to change password" });
    }
  } catch (error) {
    console.error("Error during password change:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// logout
app.post("/logout", verifyToken, (req, res) => {
  const { authorization } = req.headers;

  blacklist.push(authorization);

  res.json({ message: "Logout successful" });
});

// my vehicles of user
app.post("/myvehicles", async (req, res)=>{
  const { user_id } = req.body;
  console.log(user_id);

  const user = await client
    .db("Carview")
    .collection("user")
    .findOne({ _id: new ObjectId(user_id) });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user.vehicle_info);
});

// my sold vehicles for dealership
app.post("/mysoldvehicles", async (req, res)=>{
  const { dealership_id } = req.body;
  console.log("entered my sold", dealership_id);

  const user = await client
    .db("Carview")
    .collection("dealership")
    .findOne({ _id: new ObjectId(dealership_id) });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user.sold_vehicles);
})



// a. To view all cars deals
app.get("/cars", async (req, res) => {
  try {
    const cars = await client
      .db("Carview")
      .collection("deals")
      .find()
      .toArray();
    res.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// get car details using carid
app.post("/getcardetails", async (req, res) => {
  try {
    const { car_id } = req.body;
    console.log("we got this car id",car_id);
    // Convert car_id to ObjectId
    const objectIdCarId = new ObjectId(car_id);

    const cardetails = await client
      .db("Carview")
      .collection("cars")
      .findOne({ _id: objectIdCarId });

    console.log(cardetails);

    if (cardetails) {
      res.json(cardetails);
    } else {
      res.status(404).json({ error: "Car details not found" });
    }
  } catch (error) {
    console.error("Error fetching car details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// dealership can see all the cars of them
app.post("/dealershipcars", async (req, res) => {
  const { dealership_id } = req.body;

  const dealership = await client
    .db("Carview")
    .collection("dealership")
    .findOne({ _id: new ObjectId(dealership_id) });

  if (!dealership) {
    return res.status(404).json({ error: "Dealership not found" });
  }

  const cars = await client
    .db("Carview")
    .collection("cars")
    .find({ _id: { $in: dealership.cars } })
    .toArray();

  res.json(cars);
});

// all deals to view for user
app.get('/alldeals',async(req,res)=>{
  try {
    console.log("getting all deals");
    const dealsCollection = client.db('Carview').collection('deal');
    const allDeals = await dealsCollection.find({}).toArray();
    console.log(allDeals);
    res.send(allDeals)
  } catch (error) {
    console.log(error);
  }
})


// deals of all dealerships
app.post("/alldealershipdeals", async (req, res) => {
  const { dealership_id } = req.body;

  const dealership = await client
    .db("Carview")
    .collection("dealership")
    .findOne({ _id: ObjectId(dealership_id) });

  if (!dealership) {
    return res.status(404).json({ error: "Dealership not found" });
  }

  const deals = await client
    .db("Carview")
    .collection("deal")
    .find({ _id: { $in: dealership.deals } })
    .toArray();

  res.json(deals);
});

// dealership can add car
app.post("/addcars", async (req, res) => {
  const { type, name, model, car_info, dealership_id } = req.body;
  const newcar = {
    type,
    name,
    model,
    car_info,
  };
  try {
    const car = await client.db("Carview").collection("cars").insertOne(newcar);
    console.log(car);

    await client
      .db("Carview")
      .collection("dealership")
      .updateOne(
        { _id: new ObjectId(dealership_id) },
        { $push: { cars: car.insertedId } }
      );

    res.json({ message: "Car added successfully" });
  } catch (error) {
    console.error("Error adding car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// dealership can update car
app.post("/updatecars", async (req, res) => {
  const { type, name, model, car_info, car_id } = req.body;

  try {
    const updatedCar = await client
      .db("Carview")
      .collection("cars")
      .updateOne(
        { type: type }, // Assuming type is the unique identifier for the car
        { $set: { name: name, model: model, car_info: car_info } }
      );

    console.log(updatedCar);

    if (updatedCar.modifiedCount === 1) {
      res.json({ message: "Car updated successfully" });
    } else {
      res.status(404).json({ error: "Car not found" });
    }
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// b. To add deals to dealership
app.post("/adddeals", async (req, res) => {
  const { car_id, deal_info, dealership_id } = req.body;

  try {
    const deal = await client
      .db("Carview")
      .collection("deal")
      .insertOne({ car_id, deal_info });

    await client
      .db("Carview")
      .collection("dealership")
      .updateOne(
        { _id: new ObjectId(dealership_id) },
        { $push: { deals: deal.insertedId } }
      );

    res.json({ message: "Deal added successfully" });
  } catch (error) {
    console.error("Error adding deal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//get all dealerships

app.get("/alldealerships", async (req, res) => {
  try {
    const users = await client
      .db("Carview")
      .collection("dealership")
      .find()
      .toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// buy now button
app.post("/addsoldvehicle", async (req, res) => {
  try {
    console.log("add vehicle");
    const { car_id, vehicle_info, dealership_id, user_id } = req.body;

    const newSoldVehicle = await client
      .db("Carview")
      .collection("SoldVehicle")
      .insertOne({ car_id, vehicle_info, user_id });
    console.log("new vihicle", newSoldVehicle.insertedId);

    await client
      .db("Carview")
      .collection("dealership")
      .updateOne(
        { _id: new ObjectId(dealership_id) },
        { $push: { sold_vehicles: newSoldVehicle.insertedId } }
      );
      await client
      .db("Carview")
      .collection("user")
      .updateOne(
        { _id: new ObjectId(user_id) },
        { $push: { vehicle_info: newSoldVehicle.insertedId } }
      );
    res.send(newSoldVehicle);
  } catch (error) {
    console.log(error);
  }
});

// sold vehicles data

app.post("/soldvehiclesdata", async (req, res) => {
  try {
    const { vehicle_id } = req.body;
    console.log("inside solddata:",vehicle_id);

    // Assuming you have a collection named "soldvehicles" in your database
    const soldVehicle = await client
      .db('Carview')
      .collection('SoldVehicle')
      .findOne({ _id: new ObjectId(vehicle_id) });

    if (!soldVehicle) {
      return res.status(404).json({ error: 'Sold vehicle not found' });
    }

    // You can customize the response based on your data structure
    res.json(soldVehicle);
  } catch (error) {
    console.error('Error fetching sold vehicle details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
