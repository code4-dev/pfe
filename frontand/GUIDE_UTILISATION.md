# Guide d'Utilisation - Gestion de Projets pour Chef de Projet

## Vue d'ensemble

Cette application permet à un Chef de Projet de gérer facilement ses projets et leurs suivis avec une interface intuitive et fonctionnelle.

## Fonctionnalités Principales

### 1. **Authentification**
- Page de connexion simple et intuitive
- Démonstration : vous pouvez utiliser n'importe quel email et mot de passe
- Gestion de session utilisateur avec localStorage
- Bouton de déconnexion dans la barre de navigation

**Accès** : http://localhost:4200/login

### 2. **Dashboard - Vue d'ensemble**
- **Statistiques globales** : Affiche le nombre total de projets et leur répartition par statut
  - Projets Total
  - En Cours
  - Terminés
  - En Planification

- **Projets Récents** : Affiche les 5 derniers projets avec :
  - Nom du projet
  - Description
  - Statut (badge coloré)
  - Date d'échéance
  - Boutons d'action rapide (Modifier, Voir les suivis)

**URL** : http://localhost:4200/dashboard

### 3. **Gestion des Projets**

#### 3.1 Liste des Projets
- **Vue tableau** complète avec tous les projets
- **Recherche** en temps réel par nom ou description
- **Filtrage** par statut :
  - Tous
  - Planification
  - En cours
  - Terminés
  - Suspendus

- **Actions disponibles** :
  - **Voir les suivis** : Accéder aux suivis du projet
  - **Modifier** : Éditer les informations du projet
  - **Supprimer** : Supprimer le projet (avec confirmation)

**URL** : http://localhost:4200/projects

#### 3.2 Créer un Nouveau Projet
Accessible via le bouton "+ Nouveau Projet" dans la liste

**Champs du formulaire** :
- **Nom** (obligatoire) : Minimum 3 caractères
- **Description** (obligatoire) : Minimum 10 caractères
- **Statut** (obligatoire) : Choix entre 4 options
- **Date d'échéance** (obligatoire) : Format date

**URL** : http://localhost:4200/projects/new

#### 3.3 Modifier un Projet
Accessible via le bouton "Modifier" dans la liste

Les champs sont pré-remplis avec les données existantes

**URL** : http://localhost:4200/projects/:id/edit

### 4. **Gestion des Suivis de Projet**

#### 4.1 Liste des Suivis
Affiche tous les suivis d'un projet spécifique avec :
- **Informations du projet** : Statut, échéance, description
- **Liste des suivis** : Chaque suivi affiche :
  - Titre et date de mise à jour
  - Description de l'avancement
  - **Barre de progression** (en pourcentage avec code couleur)
    - 0-50% : Rouge (rouge-orange)
    - 50-75% : Orange
    - 75-100% : Vert
  - **Problèmes rencontrés** (si renseignés)
  - **Décisions prises** (si renseignées)
  - Actions : Modifier, Supprimer

**URL** : http://localhost:4200/projects/:projectId/followups

#### 4.2 Créer un Nouveau Suivi
Accessible via le bouton "+ Nouveau Suivi"

**Champs du formulaire** :
- **Titre** (obligatoire) : Minimum 5 caractères
  - Exemple : "Avancement du développement backend"

- **Description** (obligatoire) : Minimum 20 caractères
  - Détails sur l'avancement, tâches complétées, obstacles rencontrés

- **Avancement %** (obligatoire) : Curseur de 0 à 100%
  - Affichage en temps réel avec barre colorée
  - Incréments de 5%

- **Problèmes Rencontrés** (optionnel) :
  - Documentation des blocages et difficultés

- **Décisions Prises** (optionnel) :
  - Solutions et décisions prises pour résoudre les problèmes

**URL** : http://localhost:4200/projects/:projectId/followups/new

#### 4.3 Modifier un Suivi
Accessible via le bouton "Modifier" dans la liste des suivis

Les champs sont pré-remplis avec les données existantes

**URL** : http://localhost:4200/projects/:projectId/followups/:followupId/edit

## Workflow Complet d'Utilisation

### Scénario : Gestionnaire d'un projet E-commerce

1. **Connexion** (login.html)
   - Email : chef@example.com
   - Mot de passe : mot_de_passe
   - → Redirection vers le Dashboard

2. **Consultation du Dashboard** (/dashboard)
   - Vue des statistiques de tous les projets
   - Sélection d'un projet récent

3. **Accès à la Liste des Projets** (/projects)
   - Recherche du projet "Site Web E-commerce"
   - Filtrage par statut "En cours"

4. **Création d'un Nouveau Suivi** (/projects/1/followups/new)
   - Titre : "Intégration de la base de données"
   - Description : Détails des tâches accomplies
   - Avancement : 60%
   - Problèmes : Lenteur des requêtes identifiée
   - Décisions : Mise en place d'une stratégie d'indexation

5. **Consultation des Suivis** (/projects/1/followups)
   - Vue de tous les suivis du projet
   - Visualisation de la progression

6. **Modification d'un Suivi**
   - Mise à jour de l'avancement à 75%
   - Ajout de nouvelles informations

7. **Déconnexion**
   - Clic sur le bouton "Déconnexion" du Navbar

## Architecture et Structure

### Services
- **Auth** : Gestion de l'authentification et de la session utilisateur
- **ProjectService** : CRUD des projets, statistiques
- **FollowupService** : CRUD des suivis, gestion par projet

### Composants Principaux
- **Login** : Page d'authentification
- **Navbar** : Navigation et gestion utilisateur
- **ChefDashboard** : Vue d'ensemble avec statistiques
- **Projects** : Liste et gestion des projets
- **ProjectForm** : Création et édition de projets
- **Followups** : Liste des suivis d'un projet
- **FollowupForm** : Création et édition de suivis

### Stockage des Données
- Utilisation de **localStorage** pour persister les données
- Données mockées pour la démonstration
- Pas de backend API (à implémenter plus tard)

## Styles et Responsive Design

- **Palette de couleurs** :
  - Primaire : #3498db (Bleu)
  - Succès : #27ae60 (Vert)
  - Alerte : #f39c12 (Orange)
  - Erreur : #e74c3c (Rouge)
  - Texte : #2c3e50 (Gris foncé)

- **Design responsive** : L'application s'adapte à tous les écrans (mobile, tablet, desktop)

- **Composants UI** :
  - Tableaux avec scroll horizontal sur mobile
  - Boutons accessibles et intuitifs
  - Formulaires validés
  - Messages d'erreur clairs

## Fonctionnalités Avancées

### Validation des Formulaires
- Validation côté client avec Angular Reactive Forms
- Messages d'erreur contextuels
- Prévention de la soumission de formulaires invalides

### États de Projet
- **Planification** : Bleu clair
- **En cours** : Jaune
- **Terminé** : Vert
- **Suspendu** : Rouge

### Visualisation du Progrès
- Barre de progression avec couleurs dégradées
- Pourcentage affiché sur la barre
- Code couleur pour une lecture rapide

## Notes Techniques

### Technologies Utilisées
- **Framework** : Angular 20.x avec Standalone Components
- **Templating** : Angular Templates avec directives *ngIf, *ngFor
- **Formulaires** : Angular Reactive Forms
- **Routage** : Angular Router
- **Styling** : CSS3 avec variables et flexbox/grid

### Points d'Extension Futurs
1. **Backend API** : Remplacer localStorage par des appels HTTP
2. **Authentification** : Intégrer un vrai système d'authentification (OAuth, JWT)
3. **Permissions** : Ajouter des contrôles d'accès basés sur les rôles
4. **Base de données** : Persistence persistante avec une BDD MongoDB
5. **Notifications** : Notifications en temps réel pour les mises à jour
6. **Export** : Export des données (PDF, Excel)
7. **Commentaires** : Système de commentaires sur les suivis
8. **Historique** : Audit trail des modifications
9. **Graphiques** : Graphiques de suivi des projets dans le temps

## Support et Dépannage

### Erreurs Courantes

**1. "Projet non trouvé"**
- Vérifiez que l'ID du projet est correct dans l'URL
- Le projet peut avoir été supprimé

**2. "Formulaire invalide"**
- Vérifiez que tous les champs obligatoires sont remplis
- Respectez les contraintes de longueur minimale

**3. "Perte de données après rafraîchissement"**
- Les données sont stockées en localStorage
- Vérifier les paramètres du navigateur

## Prochaines Étapes

Pour améliorer cette application :
1. Implémenter un backend API
2. Ajouter une authentification sécurisée
3. Créer des tests unitaires
4. Ajouter plus de fonctionnalités (commentaires, pièces jointes, etc.)
5. Optimiser les performances
