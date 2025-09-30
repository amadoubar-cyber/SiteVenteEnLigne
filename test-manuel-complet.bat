@echo off
echo.
echo ========================================
echo 🧪 TESTS MANUELS COMPLETS - BOWOYE MULTI SERVICES
echo ========================================
echo.

echo 🚀 Démarrage des serveurs...
echo.

REM Démarrer le serveur backend en arrière-plan
echo 📡 Démarrage du serveur backend...
start "Backend Server" /min cmd /c "cd server && npm start"

REM Attendre que le serveur backend démarre
echo ⏳ Attente du démarrage du serveur backend...
timeout /t 5 /nobreak >nul

REM Démarrer le serveur frontend en arrière-plan
echo 🌐 Démarrage du serveur frontend...
start "Frontend Server" /min cmd /c "cd client && npm start"

REM Attendre que le serveur frontend démarre
echo ⏳ Attente du démarrage du serveur frontend...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Serveurs démarrés !
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend: http://localhost:5000
echo.

echo 🧪 Ouverture des interfaces de test...
echo.

REM Ouvrir l'interface de test complète
start "" "test-complet-admin-client.html"

REM Ouvrir le guide de test
start "" "GUIDE_TEST_COMPLET_PRE_DEPLOIEMENT.md"

REM Ouvrir l'application principale
start "" "http://localhost:3000"

echo.
echo 🎯 TESTS À EFFECTUER:
echo ========================================
echo.
echo 👨‍💼 TESTS ADMIN:
echo   • URL: http://localhost:3000/admin
echo   • Login: admin@koula.gn / admin123
echo   • Tester: Dashboard, Produits, Commandes, Utilisateurs
echo   • Vérifier: Upload d'images, Gestion du stock
echo.
echo 👤 TESTS CLIENT:
echo   • URL: http://localhost:3000
echo   • Login: client@bowoye.gn / password123
echo   • Tester: Navigation, Produits, Panier, Commandes
echo   • Vérifier: Carrousel d'images, Responsive design
echo.
echo 🔗 TESTS D'INTÉGRATION:
echo   • Créer une commande côté client
echo   • Valider la commande côté admin
echo   • Vérifier les notifications
echo   • Tester le workflow complet
echo.
echo ⚡ TESTS PERFORMANCE:
echo   • Temps de chargement des pages
echo   • Optimisation des images
echo   • Responsivité mobile/tablette
echo   • Animations fluides
echo.
echo 🔒 TESTS SÉCURITÉ:
echo   • Authentification et autorisation
echo   • Protection des routes admin
echo   • Validation des données
echo   • Upload sécurisé
echo.
echo 📋 CHECKLIST COMPLÈTE:
echo ========================================
echo.
echo ✅ FONCTIONNALITÉS ADMIN:
echo   [ ] Dashboard avec statistiques
echo   [ ] Gestion des produits (CRUD)
echo   [ ] Upload d'images (section jaune)
echo   [ ] Gestion des commandes
echo   [ ] Gestion des utilisateurs
echo   [ ] Gestion des catégories
echo   [ ] Galerie d'images
echo   [ ] Contrôle de stock
echo   [ ] Gestion des ventes
echo   [ ] Gestion des dettes
echo.
echo ✅ FONCTIONNALITÉS CLIENT:
echo   [ ] Page d'accueil avec carrousel
echo   [ ] Navigation et menus
echo   [ ] Pages produits et catégories
echo   [ ] Recherche et filtres
echo   [ ] Panier et commandes
echo   [ ] Connexion/Inscription
echo   [ ] Profil utilisateur
echo   [ ] Historique des commandes
echo   [ ] Suivi des commandes
echo   [ ] Interface responsive
echo.
echo ✅ INTÉGRATION ET PERFORMANCE:
echo   [ ] Synchronisation admin-client
echo   [ ] Notifications en temps réel
echo   [ ] Workflow complet de commande
echo   [ ] Temps de chargement < 3s
echo   [ ] Images optimisées
echo   [ ] Animations fluides (60fps)
echo   [ ] Design responsive
echo.
echo ✅ SÉCURITÉ:
echo   [ ] Authentification sécurisée
echo   [ ] Gestion des sessions
echo   [ ] Protection des routes
echo   [ ] Validation des données
echo   [ ] Upload sécurisé
echo.
echo 🎉 VALIDATION FINALE:
echo ========================================
echo.
echo Si tous les tests sont réussis:
echo   ✅ L'application est PRÊTE pour le déploiement !
echo.
echo Si des tests échouent:
echo   ⚠️ Corriger les problèmes avant le déploiement
echo.
echo 📞 Support:
echo   • Guide de test: GUIDE_TEST_COMPLET_PRE_DEPLOIEMENT.md
echo   • Interface de test: test-complet-admin-client.html
echo   • Tests automatisés: test-automatise-fonctionnalites.js
echo.
echo 🚀 L'application est prête pour les tests complets !
echo ========================================
echo.

pause
