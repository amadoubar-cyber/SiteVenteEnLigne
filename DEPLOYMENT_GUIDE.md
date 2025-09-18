# 🚀 Guide de Déploiement - Bowoye Multi Services

## 📋 **Prérequis :**

### **1. Serveur de production :**
- **Node.js** : Version 16+ 
- **MongoDB** : Version 4.4+
- **Nginx** : Pour servir les fichiers statiques
- **PM2** : Pour gérer les processus Node.js

### **2. Domaine et SSL :**
- **Nom de domaine** : bowoye.gn
- **Certificat SSL** : Let's Encrypt recommandé
- **DNS** : Pointant vers votre serveur

## 🔧 **Configuration du serveur :**

### **1. Installation des dépendances :**
```bash
# Sur le serveur
sudo apt update
sudo apt install nginx mongodb nodejs npm

# Installation de PM2
sudo npm install -g pm2
```

### **2. Configuration MongoDB :**
```bash
# Démarrer MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Créer la base de données
mongo
use koula_ecommerce
```

### **3. Configuration Nginx :**
```nginx
# /etc/nginx/sites-available/bowoye.gn
server {
    listen 80;
    server_name bowoye.gn www.bowoye.gn;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bowoye.gn www.bowoye.gn;
    
    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/bowoye.gn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bowoye.gn/privkey.pem;
    
    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Frontend React
    location / {
        root /var/www/bowoye.gn/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Uploads
    location /uploads {
        alias /var/www/bowoye.gn/server/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📦 **Déploiement :**

### **1. Préparation des fichiers :**
```bash
# Cloner le projet
git clone <votre-repo> /var/www/bowoye.gn
cd /var/www/bowoye.gn

# Installation des dépendances
cd server
npm install --production
cd ../client
npm install
npm run build
```

### **2. Configuration de production :**
```bash
# Créer .env pour la production
cd /var/www/bowoye.gn/server
cat > .env << EOF
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/koula_ecommerce
JWT_SECRET=your_super_secure_jwt_secret_here
JWT_EXPIRE=30d
EOF
```

### **3. Démarrage avec PM2 :**
```bash
# Créer ecosystem.config.js
cat > /var/www/bowoye.gn/ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'bowoye-api',
    script: './server/index.js',
    cwd: '/var/www/bowoye.gn',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Démarrer l'application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **4. Configuration Nginx :**
```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/bowoye.gn /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### **5. Certificat SSL :**
```bash
# Installation Certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d bowoye.gn -d www.bowoye.gn
```

## 🔄 **Mise à jour :**

### **1. Mise à jour du code :**
```bash
cd /var/www/bowoye.gn
git pull origin main

# Rebuild du frontend
cd client
npm run build

# Redémarrage de l'API
pm2 restart bowoye-api
```

### **2. Sauvegarde de la base de données :**
```bash
# Sauvegarde
mongodump --db koula_ecommerce --out /backup/$(date +%Y%m%d)

# Restauration
mongorestore --db koula_ecommerce /backup/20240101/koula_ecommerce
```

## 📊 **Monitoring :**

### **1. Logs PM2 :**
```bash
pm2 logs bowoye-api
pm2 monit
```

### **2. Logs Nginx :**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### **3. Monitoring système :**
```bash
htop
df -h
free -h
```

## 🛡️ **Sécurité :**

### **1. Firewall :**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### **2. Mise à jour système :**
```bash
sudo apt update
sudo apt upgrade
```

### **3. Sauvegarde automatique :**
```bash
# Crontab pour sauvegarde quotidienne
0 2 * * * mongodump --db koula_ecommerce --out /backup/$(date +\%Y\%m\%d)
```

## ✅ **Vérifications post-déploiement :**

1. **Site accessible** : https://bowoye.gn
2. **API fonctionnelle** : https://bowoye.gn/api/health
3. **Admin accessible** : https://bowoye.gn/admin-simple-complete
4. **Upload d'images** : Test complet
5. **Base de données** : Connexion établie
6. **SSL** : Certificat valide

## 🎯 **URLs de production :**

- **Site principal** : https://bowoye.gn
- **API** : https://bowoye.gn/api
- **Admin** : https://bowoye.gn/admin-simple-complete
- **Health check** : https://bowoye.gn/api/health

---
*Guide de déploiement complet - Prêt pour la production !* 🚀
