# Application de Gestion de Projets - Chef de Projet

Une application web complète pour que les Chefs de Projet gèrent facilement leurs projets et suivis avec une interface intuitive et responsive.

## 🎯 Fonctionnalités

✅ **Authentification** - Page de connexion simple  
✅ **Dashboard** - Vue d'ensemble avec statistiques  
✅ **Gestion des Projets** - Créer, modifier, supprimer, rechercher et filtrer  
✅ **Gestion des Suivis** - Tracker l'avancement avec barres de progression  
✅ **Interface Responsive** - Adaptée à tous les écrans  
✅ **Validation** - Formulaires sécurisés avec validations  

## 🛠️ Technologies

- **Angular 20.x** - Framework frontend
- **TypeScript** - Langage de programmation
- **CSS3** - Styling responsive
- **localStorage** - Stockage des données côté client

## 📋 Prérequis

- Node.js 18.x ou supérieur
- npm 9.x ou supérieur
- Angular CLI 20.x

## 🚀 Installation et Démarrage

### 1. Installation des dépendances
```bash
npm install
```

### 2. Démarrage du serveur de développement
```bash
npm start
```

L'application sera accessible sur `http://localhost:4200`

### 3. Accès
- **Page de connexion** : http://localhost:4200/login
- **Identifiants** : Utilisez n'importe quel email/mot de passe (mode démonstration)

## 📁 Structure du Projet

```
src/app/
├── core/
│   ├── features/
│   │   ├── login/                 # Page de connexion
│   │   └── chef/
│   │       ├── dashboard/         # Vue d'ensemble
│   │       ├── projects/          # Gestion des projets
│   │       └── followups/         # Gestion des suivis
│   └── services/
│       ├── auth.ts                # Service d'authentification
│       ├── project.ts             # Service des projets
│       └── followup.ts            # Service des suivis
├── shared/
│   └── navbar/                    # Barre de navigation
├── app.ts                         # Composant racine
├── app.routes.ts                  # Configuration des routes
└── app.config.ts                  # Configuration de l'app
```

## 🎨 Pages Principales

### Login (`/login`)
Page d'authentification simple

### Dashboard (`/dashboard`)
- Vue d'ensemble avec statistiques
- Affichage des projets récents
- Accès rapide aux fonctionnalités

### Projets (`/projects`)
- Liste complète des projets en tableau
- Recherche et filtrage par statut
- Actions : créer, modifier, supprimer, voir les suivis

### Formulaire Projet (`/projects/new`, `/projects/:id/edit`)
- Création et édition de projets
- Validation des champs
- Gestion des statuts

### Suivis Projet (`/projects/:projectId/followups`)
- Liste des suivis d'un projet
- Barres de progression colorées
- Actions : créer, modifier, supprimer

### Formulaire Suivi (`/projects/:projectId/followups/new`, `/projects/:projectId/followups/:followupId/edit`)
- Création et édition de suivis
- Curseur pour l'avancement
- Champs pour problèmes et décisions

## 🔑 Fonctionnalités Détaillées

### Statuts de Projet
- 🔵 **Planification** - Projet en phase de planification
- 🟡 **En cours** - Projet actif
- 🟢 **Terminé** - Projet complété
- 🔴 **Suspendu** - Projet en pause

### Barre de Progression
- **0-50%** : Rouge (bas avancement)
- **50-75%** : Orange (avancement moyen)
- **75-100%** : Vert (avancement élevé)

### Validations Formulaires
- Nom : minimum 3 caractères
- Description projet : minimum 10 caractères
- Titre suivi : minimum 5 caractères
- Description suivi : minimum 20 caractères
- Avancement : 0-100%

## 💾 Stockage des Données

L'application utilise **localStorage** pour persister les données :
- `user` - Données utilisateur authentifié
- `projects` - Liste des projets
- `followups` - Liste des suivis

Les données sont mockées initialement mais peuvent être remplacées par une API backend.

## 🧪 Construction

```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`

## 📊 Exemple de Données

### Projet
```typescript
{
  id: '1',
  name: 'Site Web E-commerce',
  description: 'Développement du site e-commerce',
  status: 'en-cours',
  dueDate: '2026-03-31',
  createdAt: '2026-01-01',
  chefId: '1'
}
```

### Suivi
```typescript
{
  id: '1',
  projectId: '1',
  title: 'Mise en place de la base de données',
  description: 'Configuration initiale de MongoDB',
  progress: 80,
  issues: 'Problèmes de performance identifiés',
  decisions: 'Mise en place d\'une stratégie d\'indexation',
  createdAt: '2026-01-15',
  updatedAt: '2026-01-20'
}
```

## 🔐 Sécurité

**Note** : Cette version est une démonstration. Pour la production :
- Implémenter une authentification sécurisée (OAuth, JWT)
- Ajouter HTTPS
- Valider les données côté serveur
- Implémenter le CORS
- Ajouter des tokens de sécurité
- Audit des actions utilisateur

## 🚧 Améliorations Futures

- [ ] Backend API (Node.js, Django, etc.)
- [ ] Base de données persistante
- [ ] Authentification sécurisée (JWT)
- [ ] Tests unitaires et E2E
- [ ] Graphiques et statistiques avancées
- [ ] Système de commentaires
- [ ] Pièces jointes
- [ ] Notifications en temps réel
- [ ] Export de données (PDF, Excel)
- [ ] Historique d'audit
- [ ] Multi-utilisateurs avec permissions
- [ ] Intégrations (Slack, email, etc.)

## 📞 Support

Pour des questions ou bugs, veuillez contacter le responsable du projet.

## 📝 Licence

Ce projet est développé à titre de Projet de Fin d'Études.

---

**Développé avec ❤️ en Angular 20**
