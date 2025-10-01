# 🌐 Guide de Configuration du Domaine bowoye.com

## 📋 Étapes pour configurer bowoye.com avec Vercel

### 1️⃣ ACHETER LE DOMAINE

#### Option A : OVHcloud (Recommandé pour la Guinée)
1. Aller sur [ovhcloud.com/fr/domains](https://www.ovhcloud.com/fr/domains/)
2. Rechercher "bowoye.com"
3. Ajouter au panier (~12€/an)
4. Finaliser l'achat

#### Option B : Namecheap (International)
1. Aller sur [namecheap.com](https://www.namecheap.com)
2. Rechercher "bowoye.com"
3. Ajouter au panier (~10€/an)
4. Finaliser l'achat

### 2️⃣ CONFIGURER DNS AVEC VERCEL

#### Dans Vercel Dashboard :
1. Aller dans votre projet
2. Cliquer sur "Settings" → "Domains"
3. Ajouter "bowoye.com"
4. Copier les enregistrements DNS fournis

#### Enregistrements DNS à ajouter :
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3️⃣ CONFIGURER DANS LE REGISTRAR

#### OVHcloud :
1. Se connecter au manager
2. Aller dans "Web Cloud" → "Domaines"
3. Cliquer sur "bowoye.com"
4. Aller dans "Zone DNS"
5. Ajouter les enregistrements Vercel

#### Namecheap :
1. Se connecter au compte
2. Aller dans "Domain List"
3. Cliquer sur "Manage" pour bowoye.com
4. Aller dans "Advanced DNS"
5. Ajouter les enregistrements Vercel

### 4️⃣ ATTENDRE LA PROPAGATION

- **Délai :** 24-48 heures
- **Vérification :** Utiliser [whatsmydns.net](https://www.whatsmydns.net)

### 5️⃣ TESTER LE DOMAINE

Une fois propagé :
- `https://bowoye.com` → Site principal
- `https://www.bowoye.com` → Redirection automatique

## 🔧 Configuration Alternative : Sous-domaine Vercel

### Si vous ne voulez pas acheter le domaine :

#### 1. Utiliser le sous-domaine Vercel :
- URL : `https://bowoye-multiservices.vercel.app`
- Gratuit et immédiat
- Professionnel

#### 2. Rediriger vers un domaine personnalisé plus tard :
- Acheter bowoye.com quand vous voulez
- Migration transparente avec Vercel

## 💡 Recommandation

### Pour Bowoye Multi Services :
1. **Court terme :** Utiliser `bowoye-multiservices.vercel.app`
2. **Long terme :** Acheter `bowoye.com` quand le budget le permet
3. **Alternative :** `bowoye.gn` (domaine Guinée) si disponible

## 🎯 Avantages du domaine personnalisé

- ✅ **Professionnel** : Plus crédible
- ✅ **SEO** : Meilleur référencement
- ✅ **Email** : contact@bowoye.com
- ✅ **Branding** : Marque forte
- ✅ **Mémorisation** : Plus facile à retenir

## 📞 Support

Si vous avez des questions :
- Vercel : [vercel.com/support](https://vercel.com/support)
- OVHcloud : [support.ovhcloud.com](https://support.ovhcloud.com)
