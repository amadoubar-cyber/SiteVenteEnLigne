# 🔧 Guide de Dépannage

## 🚨 Erreur lors de la commande

Si vous rencontrez une erreur lors de l'exécution d'une commande, voici les solutions les plus courantes :

## 📋 Commandes de Base

### 1. Démarrer l'Application
```bash
# Option 1: Script automatique (recommandé)
start-client-only.bat

# Option 2: Manuel
cd client
npm start
```

### 2. Vérifier l'État de l'Application
```bash
# Vérifier si le port 3001 est utilisé
netstat -an | findstr :3001

# Vérifier les processus Node.js
tasklist | findstr node
```

### 3. Arrêter l'Application
```bash
# Arrêter tous les processus Node.js
taskkill /f /im node.exe

# Ou fermer les fenêtres de commande
```

## 🔍 Erreurs Courantes et Solutions

### Erreur: "Port 3000 already in use"
**Solution:**
```bash
# L'application utilise maintenant le port 3001
# Ouvrir: http://localhost:3001
```

### Erreur: "npm start" ne fonctionne pas
**Solution:**
```bash
# Vérifier que vous êtes dans le bon dossier
cd client

# Vérifier que node_modules existe
dir node_modules

# Si node_modules n'existe pas, installer les dépendances
npm install
```

### Erreur: "Cannot find module"
**Solution:**
```bash
# Supprimer node_modules et package-lock.json
rmdir /s node_modules
del package-lock.json

# Réinstaller les dépendances
npm install
```

### Erreur: "Permission denied"
**Solution:**
```bash
# Exécuter PowerShell en tant qu'administrateur
# Ou utiliser cmd au lieu de PowerShell
```

## 🧪 Tests de Fonctionnement

### 1. Test de l'Application
```
http://localhost:3001
```

### 2. Test des Images
```
http://localhost:3001/test-images-simple.html
```

### 3. Test des Produits
```
http://localhost:3001/test-products-display.html
```

### 4. Test de la Page de Détail
```
http://localhost:3001/test-product-detail-direct.html
```

## 📊 Vérifications Système

### 1. Vérifier Node.js
```bash
node --version
npm --version
```

### 2. Vérifier les Ports
```bash
# Port 3000 (ancien)
netstat -an | findstr :3000

# Port 3001 (actuel)
netstat -an | findstr :3001
```

### 3. Vérifier les Fichiers
```bash
# Vérifier que les fichiers existent
dir client\public\products-data.json
dir client\public\adminProducts.json
dir client\public\test-images-simple.html
```

## 🚀 Solutions Rapides

### Redémarrage Complet
```bash
# 1. Arrêter l'application
taskkill /f /im node.exe

# 2. Attendre 5 secondes
timeout /t 5

# 3. Redémarrer
start-client-only.bat
```

### Réinitialisation Complète
```bash
# 1. Arrêter l'application
taskkill /f /im node.exe

# 2. Supprimer node_modules
rmdir /s client\node_modules
del client\package-lock.json

# 3. Réinstaller
cd client
npm install

# 4. Redémarrer
npm start
```

## 📞 Support

Si l'erreur persiste, fournissez :
1. **Commande exacte** que vous avez lancée
2. **Message d'erreur complet**
3. **Système d'exploitation** (Windows 10/11)
4. **Version de Node.js** (`node --version`)

## 🎯 Commandes de Test Rapide

```bash
# Test 1: Vérifier l'état
netstat -an | findstr :3001

# Test 2: Démarrer l'application
start-client-only.bat

# Test 3: Ouvrir dans le navigateur
start http://localhost:3001
```

## ✅ Vérification Finale

L'application fonctionne correctement si :
- ✅ Port 3001 est en écoute
- ✅ http://localhost:3001 s'ouvre
- ✅ Les produits s'affichent
- ✅ Les images sont visibles
- ✅ La page de détail fonctionne
