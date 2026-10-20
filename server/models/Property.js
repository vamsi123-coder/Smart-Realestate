const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerName: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['Flat', 'Villa', 'Land', 'Commercial'],
      required: true,
    },
    price: { type: Number, required: true },
    area: { type: Number, required: true }, // in sq. ft.
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    furnished: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished', 'NA'],
      default: 'NA',
    },
    facing: {
      type: String,
      enum: ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West', 'NA'],
      default: 'NA',
    },
    ageOfProperty: { type: Number, default: 0 }, // 0 = New Construction
    totalFloors: { type: Number, default: 0 },
    floorNumber: { type: Number, default: 0 },
    carParking: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Sold'], default: 'Active' },
  },
  { timestamps: true }
);

// Text index for search
propertySchema.index({
  title: 'text',
  'location.city': 'text',
  'location.state': 'text',
  'location.address': 'text',
  description: 'text',
});

module.exports = mongoose.model('Property', propertySchema);
