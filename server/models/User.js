const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firebaseUID: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // only for email/password auth users
    phone: { type: String, default: '' },
    profilePhoto: { type: String, default: '' },
    authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
  },
  { timestamps: true }
);

// Hash password before saving (only for email/password users)
// Note: Mongoose 9 async middleware — no next() needed, promise resolution signals completion
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
