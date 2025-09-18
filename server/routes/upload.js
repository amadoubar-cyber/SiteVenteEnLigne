const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Garder le nom original avec un timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Route pour uploader une image
router.post('/image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploadée avec succès',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Erreur upload image:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
  }
});

// Route pour uploader plusieurs images
router.post('/images', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }

    const imageUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));
    
    res.json({
      success: true,
      message: 'Images uploadées avec succès',
      images: imageUrls
    });
  } catch (error) {
    console.error('Erreur upload images:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload des images' });
  }
});

// Route pour supprimer une image
router.delete('/image/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'Image supprimée avec succès' });
    } else {
      res.status(404).json({ message: 'Image non trouvée' });
    }
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'image' });
  }
});

// Route pour lister toutes les images
router.get('/images', (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({ images: [] });
    }
    
    const files = fs.readdirSync(uploadDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/uploads/${file}`,
        size: fs.statSync(path.join(uploadDir, file)).size,
        created: fs.statSync(path.join(uploadDir, file)).birthtime
      }))
      .sort((a, b) => new Date(b.created) - new Date(a.created));
    
    res.json({ images });
  } catch (error) {
    console.error('Erreur liste images:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des images' });
  }
});

module.exports = router;

