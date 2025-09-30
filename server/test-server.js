
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes de test
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Serveur fonctionnel', 
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

app.get('/api/products', (req, res) => {
    res.json({
        products: [
            {
                _id: 'prod-1',
                name: 'Test Product',
                price: 1000,
                stock: 10
            }
        ]
    });
});

app.post('/api/auth/login', (req, res) => {
    res.json({
        success: true,
        message: 'Login test réussi',
        user: {
            _id: 'user-1',
            email: req.body.email,
            role: 'user'
        }
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur de test démarré sur le port ${PORT}`);
    console.log(`🌐 API disponible sur: http://localhost:${PORT}/api`);
    console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
});

module.exports = app;
