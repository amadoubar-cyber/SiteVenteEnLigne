# API Documentation - Koula E-commerce

## Base URL
```
http://localhost:5000/api
```

## Authentification
L'API utilise JWT (JSON Web Tokens) pour l'authentification. Incluez le token dans l'en-tête Authorization :
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 🔐 Authentification

#### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+224 123 456 789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+224 123 456 789",
      "role": "user"
    }
  }
}
```

#### POST /auth/login
Connexion d'un utilisateur

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Récupérer le profil de l'utilisateur connecté

**Headers:** `Authorization: Bearer <token>`

#### PUT /auth/profile
Mettre à jour le profil utilisateur

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+224 123 456 789",
  "address": {
    "street": "123 Main St",
    "city": "Conakry",
    "postalCode": "001",
    "country": "Guinée"
  }
}
```

#### PUT /auth/password
Changer le mot de passe

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### 📦 Produits

#### GET /products
Récupérer la liste des produits avec filtres

**Query Parameters:**
- `page` (number): Numéro de page (défaut: 1)
- `limit` (number): Nombre d'éléments par page (défaut: 12)
- `category` (string): ID de la catégorie
- `minPrice` (number): Prix minimum
- `maxPrice` (number): Prix maximum
- `search` (string): Terme de recherche
- `sort` (string): Champ de tri (défaut: createdAt)
- `order` (string): Ordre de tri (asc/desc, défaut: desc)
- `featured` (boolean): Produits vedettes uniquement

**Example:**
```
GET /products?page=1&limit=12&category=cat-id&search=iphone&sort=price&order=asc
```

#### GET /products/:id
Récupérer un produit par ID

#### GET /products/:id/recommended
Récupérer les produits recommandés pour un produit

#### POST /products (Admin)
Créer un nouveau produit

**Headers:** `Authorization: Bearer <admin-token>`

**Body:**
```json
{
  "name": "iPhone 14 Pro",
  "description": "Description du produit",
  "price": 1200000,
  "originalPrice": 1300000,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Description de l'image"
    }
  ],
  "category": "category-id",
  "stock": 15,
  "sku": "IPH14P-001",
  "weight": 0.206,
  "features": [
    {
      "name": "Écran",
      "value": "6.1 pouces"
    }
  ],
  "tags": ["smartphone", "apple"],
  "isFeatured": true
}
```

#### PUT /products/:id (Admin)
Mettre à jour un produit

#### DELETE /products/:id (Admin)
Supprimer un produit

#### POST /products/:id/reviews
Ajouter un avis sur un produit

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent produit !"
}
```

### 🏷️ Catégories

#### GET /categories
Récupérer toutes les catégories

#### GET /categories/:id
Récupérer une catégorie par ID

#### POST /categories (Admin)
Créer une nouvelle catégorie

**Body:**
```json
{
  "name": "Électronique",
  "description": "Smartphones, ordinateurs, accessoires",
  "image": "https://example.com/category.jpg"
}
```

#### PUT /categories/:id (Admin)
Mettre à jour une catégorie

#### DELETE /categories/:id (Admin)
Supprimer une catégorie

#### GET /categories/stats (Admin)
Récupérer les statistiques des catégories

### 🛒 Commandes

#### POST /orders
Créer une nouvelle commande

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "items": [
    {
      "product": "product-id",
      "quantity": 2,
      "price": 1200000
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main St",
    "city": "Conakry",
    "postalCode": "001",
    "country": "Guinée",
    "phone": "+224 123 456 789"
  },
  "paymentMethod": "mobile_money",
  "notes": "Instructions spéciales"
}
```

#### GET /orders/my-orders
Récupérer les commandes de l'utilisateur connecté

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Numéro de page
- `limit` (number): Nombre d'éléments par page
- `status` (string): Filtrer par statut

#### GET /orders/:id
Récupérer une commande par ID

**Headers:** `Authorization: Bearer <token>`

#### PUT /orders/:id/cancel
Annuler une commande

**Headers:** `Authorization: Bearer <token>`

#### GET /orders (Admin)
Récupérer toutes les commandes

**Headers:** `Authorization: Bearer <admin-token>`

#### PUT /orders/:id/status (Admin)
Mettre à jour le statut d'une commande

**Body:**
```json
{
  "orderStatus": "shipped",
  "trackingNumber": "TRK123456789",
  "estimatedDelivery": "2024-01-15T10:00:00Z"
}
```

#### GET /orders/stats (Admin)
Récupérer les statistiques des commandes

### 🏥 Santé de l'API

#### GET /health
Vérifier l'état de l'API

**Response:**
```json
{
  "success": true,
  "message": "API Koula E-commerce fonctionne correctement",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "environment": "development"
}
```

## Codes de Statut HTTP

- `200` - Succès
- `201` - Créé avec succès
- `400` - Requête invalide
- `401` - Non authentifié
- `403` - Non autorisé
- `404` - Ressource non trouvée
- `500` - Erreur serveur

## Format des Réponses

### Succès
```json
{
  "success": true,
  "message": "Message de succès",
  "data": {
    // Données de la réponse
  }
}
```

### Erreur
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": [
    // Détails des erreurs de validation
  ]
}
```

## Pagination

Les endpoints qui retournent des listes incluent des informations de pagination :

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Limitation de Taux

L'API est limitée à 100 requêtes par 15 minutes par adresse IP.

## Upload de Fichiers

Pour l'upload d'images de produits, utilisez le endpoint :
```
POST /upload
Content-Type: multipart/form-data
```

**Body:**
- `image`: Fichier image (max 5MB)
- `type`: Type d'upload (product, category, etc.)

## Exemples d'Utilisation

### JavaScript/Fetch
```javascript
// Connexion
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@koula.gn',
    password: 'admin123'
  })
});

const data = await response.json();
const token = data.data.token;

// Récupérer les produits
const productsResponse = await fetch('http://localhost:5000/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### cURL
```bash
# Connexion
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@koula.gn","password":"admin123"}'

# Récupérer les produits
curl -X GET http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
