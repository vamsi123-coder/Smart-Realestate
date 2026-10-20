const Property = require('../models/Property');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Get All Properties with Filters ────────────────────────────────────────
const getProperties = async (req, res) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      city,
      state,
      furnished,
      keyword,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    if (type) query.type = type;
    if (furnished) query.furnished = furnished;
    if (status) query.status = status;
    else query.status = 'Active';

    if (bedrooms) {
      if (bedrooms === '4+') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    if (city) query['location.city'] = { $regex: city, $options: 'i' };
    if (state) query['location.state'] = { $regex: state, $options: 'i' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { 'location.city': { $regex: keyword, $options: 'i' } },
        { 'location.address': { $regex: keyword, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'area_asc') sortOption = { area: 1 };
    if (sort === 'area_desc') sortOption = { area: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('owner', 'name email phone profilePhoto');

    res.json({
      properties,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Single Property ─────────────────────────────────────────────────────
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone profilePhoto'
    );
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Create Property ─────────────────────────────────────────────────────────
const createProperty = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.phone) {
      return res.status(400).json({
        message: 'Please add your phone number in your profile before listing a property.',
      });
    }

    const {
      title,
      description,
      type,
      price,
      area,
      bedrooms,
      bathrooms,
      location,
      amenities,
      images,
      furnished,
      facing,
      ageOfProperty,
      totalFloors,
      floorNumber,
      carParking,
    } = req.body;

    const property = await Property.create({
      owner: user._id,
      ownerName: user.name,
      ownerPhone: user.phone,
      title,
      description,
      type,
      price,
      area,
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      location,
      amenities: amenities || [],
      images: images || [],
      furnished: furnished || 'NA',
      facing: facing || 'NA',
      ageOfProperty: ageOfProperty || 0,
      totalFloors: totalFloors || 0,
      floorNumber: floorNumber || 0,
      carParking: carParking || 0,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Property ─────────────────────────────────────────────────────────
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to edit this property' });
    }

    // Keep owner contact always synced with user profile
    const user = await User.findById(req.userId);
    req.body.ownerName = user.name;
    req.body.ownerPhone = user.phone;

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Property ─────────────────────────────────────────────────────────
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this property' });
    }

    // Delete images from Cloudinary
    if (property.images && property.images.length > 0) {
      for (const imageUrl of property.images) {
        try {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`smart_realestate/${publicId}`);
        } catch (_) {}
      }
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get My Properties ───────────────────────────────────────────────────────
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.userId }).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Upload Image to Cloudinary ──────────────────────────────────────────────
const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'smart_realestate', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
  uploadImage,
};
