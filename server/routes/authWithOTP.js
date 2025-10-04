const express = require('express');
const router = express.Router();
const UserWithOTP = require('../models/UserWithOTP');
const professionalEmailService = require('../services/professionalEmailService');
const jwt = require('jsonwebtoken');

// Fonction pour générer un token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '7d' });
};

// Route d'inscription selon votre méthode
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserWithOTP.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Un compte avec cet email existe déjà' 
      });
    }

    // Générer un code OTP selon votre méthode
    const otp = professionalEmailService.generateOTP();
    const expiration = Date.now() + 10 * 60 * 1000; // expire dans 10 min

    // Créer l'utilisateur avec OTP selon votre méthode
    const newUser = new UserWithOTP({
      email,
      password,
      firstName,
      lastName,
      phone,
      otp,
      otpExpiration: new Date(expiration),
      verified: false
    });

    await newUser.save();

    // Envoyer l'email selon votre méthode
    await professionalEmailService.sendVerificationEmail(email, firstName, lastName, otp);

    res.json({ 
      success: true, 
      message: 'Un code de vérification a été envoyé sur votre email.',
      email: email
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'inscription' 
    });
  }
});

// Route de vérification selon votre méthode
router.post('/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await UserWithOTP.findOne({ email });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    if (user.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email déjà vérifié' 
      });
    }

    // Vérifier l'OTP selon votre méthode
    const otpResult = user.verifyOTP(otp);
    if (!otpResult.success) {
      return res.status(400).json({ 
        success: false, 
        message: otpResult.message 
      });
    }

    // Nettoyer l'OTP et marquer comme vérifié
    await user.clearOTP();

    // Générer un token JWT
    const token = generateToken(user._id);

    res.json({ 
      success: true, 
      message: 'Email vérifié avec succès !',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Erreur vérification:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification' 
    });
  }
});

// Route pour renvoyer un code OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserWithOTP.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    if (user.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email déjà vérifié' 
      });
    }

    // Générer un nouveau code OTP
    const otp = professionalEmailService.generateOTP();
    const expiration = Date.now() + 10 * 60 * 1000; // expire dans 10 min

    user.otp = otp;
    user.otpExpiration = new Date(expiration);
    await user.save();

    // Renvoyer l'email
    await professionalEmailService.sendVerificationEmail(email, user.firstName, user.lastName, otp);

    res.json({ 
      success: true, 
      message: 'Un nouveau code de vérification a été envoyé sur votre email.' 
    });

  } catch (error) {
    console.error('Erreur renvoi OTP:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du renvoi du code' 
    });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserWithOTP.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    if (!user.verified) {
      return res.status(400).json({ 
        success: false, 
        message: 'Veuillez vérifier votre email avant de vous connecter' 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }

    // Mettre à jour la dernière connexion
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({ 
      success: true, 
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la connexion' 
    });
  }
});

module.exports = router;
