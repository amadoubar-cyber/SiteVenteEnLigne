const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userWithOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  // Champs OTP selon votre méthode
  otp: {
    type: Number,
    default: null
  },
  otpExpiration: {
    type: Date,
    default: null
  },
  verified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// Hachage du mot de passe avant sauvegarde
userWithOTPSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier le mot de passe
userWithOTPSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour vérifier l'OTP
userWithOTPSchema.methods.verifyOTP = function(inputOTP) {
  if (!this.otp || !this.otpExpiration) {
    return { success: false, message: 'Aucun code de vérification en attente' };
  }
  
  if (Date.now() > this.otpExpiration) {
    return { success: false, message: 'Code de vérification expiré' };
  }
  
  if (this.otp !== parseInt(inputOTP)) {
    return { success: false, message: 'Code de vérification incorrect' };
  }
  
  return { success: true, message: 'Code de vérification correct' };
};

// Méthode pour nettoyer l'OTP après vérification
userWithOTPSchema.methods.clearOTP = function() {
  this.otp = null;
  this.otpExpiration = null;
  this.verified = true;
  return this.save();
};

module.exports = mongoose.model('UserWithOTP', userWithOTPSchema);
