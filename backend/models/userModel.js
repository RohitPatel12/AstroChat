import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false, // Do not return password by default
  },
  phone: {
    type: String,
    trim: true,
  },

  // Role-based access control
  role: {
    type: String,
    enum: ['user', 'astrologer', 'admin'],
    default: 'user',
  },
  verify_email : {
    type : Boolean,
    default : false
  },
  // Astrologer-specific fields
  isApproved: {
    type: Boolean,
    default: false, // Admin can approve astrologers later
  },
  bio: {
    type: String,
    trim: true,
  },
  experience: {
    type: Number, // in years
  },
  languages: {
    type: [String],
    default: [],
  },
  specialties: {
    type: [String], // e.g., Tarot, Vedic
    default: [],
  },

  avatar: {
    public_id: String,
    url: String,
  },

  // Bookings associated (when added later)
  consultations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }],

  // Admin-based flag (useful for blocking spam)
  isBlocked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});


// 🔒 Password Hashing Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Password Comparison Method (for login)
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export
const UserModel = mongoose.model('User', userSchema);
export default UserModel;
