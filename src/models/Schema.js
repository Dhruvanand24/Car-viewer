
const adminSchema = {
  admin_id: { type: 'string', unique: true, required: true },
  password: 'string',
};

// Car Buyer (User) schema
const userSchema = {
  user_email: { type: 'string', unique: true, required: true },
  user_id: { type: 'string', default: () => Math.random().toString(36).substring(2) },
  user_location: 'string',
  user_info: 'object',
  password: 'string',
  vehicle_info: [{ type: 'ObjectId', ref: 'SoldVehicle' }],
};

// Car Seller (Dealership) schema
const dealershipSchema = {
  dealership_email: { type: 'string', unique: true, required: true },
  dealership_id: { type: 'string', default: () => Math.random().toString(36).substring(2) },
  dealership_name: 'string',
  dealership_location: 'string',
  password: 'string',
  dealership_info: 'object',
  cars: [{ type: 'ObjectId', ref: 'Car' }],
  deals: [{ type: 'ObjectId', ref: 'Deal' }],
  sold_vehicles: [{ type: 'ObjectId', ref: 'SoldVehicle' }],
};

// Available Car Deals (Deal) schema
const dealSchema = {
  deal_id: { type: 'string', default: () => Math.random().toString(36).substring(2) },
  car_id: 'string',
  deal_info: 'object',
};

// Info on Cars (Cars) schema
const carSchema = {
  car_id: { type: 'string', default: () => Math.random().toString(36).substring(2) },
  type: 'string',
  name: 'string',
  model: 'string',
  car_info: 'object',
};

// Cars Sold (SoldVehicles) schema
const soldVehicleSchema = {
  vehicle_id: { type: 'string', default: () => Math.random().toString(36).substring(2) },
  car_id: 'string',
  vehicle_info: 'object',
};


// Create models
