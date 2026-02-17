# 🚀 Quick Start Guide

## ⚡ Démarrage Rapide en 3 Étapes

### 1️⃣ Installation (1 minute)
```bash
npm install
```

### 2️⃣ Lancement du serveur (30 secondes)
```bash
npm start
```

L'application démarre sur `http://localhost:4200`

### 3️⃣ Accès à l'application
- **Ouvrir le navigateur** : http://localhost:4200/login
- **Email** : Utilisez n'importe quel email (ex: chef@example.com)
- **Mot de passe** : Utilisez n'importe quel mot de passe
- **Cliquer** : Se Connecter

✅ **Vous êtes connecté et pouvez naviguer l'application!**

---

## 🎯 Premières Actions à Essayer

### Option 1: Voir le Dashboard
Après connexion, vous êtes automatiquement redirigé vers le dashboard.
- Voir les statistiques
- Voir les projets récents
- Cliquer sur "Mes Projets" dans le navbar

### Option 2: Créer un Projet
1. Aller sur "Mes Projets"
2. Cliquer "+ Nouveau Projet"
3. Remplir le formulaire:
   - **Nom** : "Mon Premier Projet"
   - **Description** : "Ceci est un test du système de gestion de projets"
   - **Statut** : "En cours"
   - **Échéance** : Choisir une date
4. Cliquer "Créer"

### Option 3: Créer un Suivi
1. Aller sur "Mes Projets"
2. Cliquer "Suivis" pour un projet
3. Cliquer "+ Nouveau Suivi"
4. Remplir:
   - **Titre** : "Démarrage du projet"
   - **Description** : "Phase initiale de configuration et planification. Toutes les ressources nécessaires sont en place pour commencer le développement."
   - **Avancement** : Bouger le curseur à 50%
5. Cliquer "Créer"

---

## 📱 Navigation Principale

```
┌─ Login
│
├─ Dashboard (Vue statistiques)
│  └─ Boutons rapides vers projets
│
├─ Mes Projets (Liste)
│  ├─ Nouveau Projet
│  ├─ Modifier Projet
│  ├─ Supprimer Projet
│  └─ Voir Suivis
│
└─ Suivis (Par Projet)
   ├─ Nouveau Suivi
   ├─ Modifier Suivi
   └─ Supprimer Suivi
```

---

## 🛠️ Commandes Utiles

### Développement
```bash
npm start           # Lance le serveur de développement
npm run build       # Crée une version de production
npm test            # Lance les tests
```

### Arrêter le serveur
```bash
Ctrl + C
```

---

## 📊 Données de Test Pré-chargées

L'application vient avec 3 projets de test :

1. **Site Web E-commerce**
   - Statut: En cours
   - Échéance: 31/03/2026
   - Avec 2 suivis

2. **Application Mobile CRM**
   - Statut: Planification
   - Échéance: 30/06/2026

3. **Système de Reporting**
   - Statut: Suspendu
   - Échéance: 15/05/2026

---

## 🎨 Fonctionnalités à Explorer

### Dashboard
- [ ] Vérifier les statistiques
- [ ] Cliquer sur "Voir tous les projets"
- [ ] Cliquer sur "Suivis" pour un projet

### Projets
- [ ] Rechercher "Site Web"
- [ ] Filtrer par "En cours"
- [ ] Créer un nouveau projet
- [ ] Modifier un projet
- [ ] Supprimer un projet

### Suivis
- [ ] Voir les suivis d'un projet
- [ ] Créer un nouveau suivi
- [ ] Observer la barre de progression
- [ ] Modifier l'avancement
- [ ] Ajouter des problèmes et décisions

### Interface
- [ ] Tester sur mobile (F12 → Device)
- [ ] Tester la recherche
- [ ] Tester les filtres
- [ ] Observer les validations

---

## 📋 Checklist de Démonstration

- [ ] Authentification fonctionne
- [ ] Dashboard affiche bien
- [ ] Projets visibles dans la liste
- [ ] Création d'un nouveau projet
- [ ] Modification d'un projet
- [ ] Suppression d'un projet
- [ ] Voir les suivis
- [ ] Créer un suivi
- [ ] Barre de progression visible
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Responsive sur mobile
- [ ] Déconnexion fonctionne

---

## 💡 Tips & Tricks

### Pour tester les validations
1. Aller sur "Nouveau Projet"
2. Laisser des champs vides
3. Cliquer "Créer"
4. Observer les erreurs

### Pour voir localStorage
1. F12 (Outils de développement)
2. Application → localStorage
3. Chercher "projects", "followups", "user"

### Pour réinitialiser les données
Dans la console (F12 → Console):
```javascript
localStorage.clear();
location.reload();
```

### Pour changer rapidement le port
Si le port 4200 est occupé:
```bash
ng serve --port 4300
```

---

## 🆘 Dépannage

### Application ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
npm start
```

### Port 4200 déjà utilisé
```bash
# Utiliser un autre port
ng serve --port 4300
```

### Données manquantes après reload
Les données sont stockées en localStorage. Si elles disparaissent :
1. F12 → Application → localStorage
2. Vérifier que "projects" et "user" existent
3. Sinon, créer de nouveaux projets

### Formulaire ne se soumet pas
- Vérifier que tous les champs obligatoires sont remplis
- Observer les messages d'erreur rouges
- Respecter les longueurs minimales

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **[README_APPLICATION.md](README_APPLICATION.md)** - Guide utilisateur complet
- **[GUIDE_UTILISATION.md](GUIDE_UTILISATION.md)** - Manuel détaillé des fonctionnalités
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Explication technique de l'architecture
- **[GUIDE_TEST.md](GUIDE_TEST.md)** - Tous les cas de test
- **[RESUME_IMPLEMENTATION.md](RESUME_IMPLEMENTATION.md)** - Résumé complet du projet

---

## 🎯 Prochaines Étapes

Après avoir exploré l'application :

1. **Créer plusieurs projets** pour voir la liste se remplir
2. **Créer plusieurs suivis** pour chaque projet
3. **Tester la recherche** avec différents termes
4. **Tester les filtres** par statut
5. **Modifier les projets** et suivis
6. **Observer le responsive** sur mobile

---

## 📞 Besoin d'aide?

Consultez les fichiers markdown dans le dossier racine du projet pour :
- Guide d'utilisation complet
- Architecture technique
- Cas de test détaillés
- Instructions d'installation avancées

---

**Bon test de l'application ! 🎉**

Pour des questions techniques, consultez la documentation ou les fichiers source.
