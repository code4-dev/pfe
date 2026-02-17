# Cas d'Usage et Scénarios de Test

## 🎯 Objectif Global

Valider que l'application permet à un Chef de Projet de :
1. ✅ Se connecter
2. ✅ Consulter un dashboard avec statistiques
3. ✅ Gérer (CRUD) ses projets
4. ✅ Tracker l'avancement des projets avec des suivis
5. ✅ Naviguer intuitivement entre les fonctionnalités
6. ✅ Quitter de façon sécurisée

---

## 📋 Cas de Test 1: Authentification

### Scénario 1.1 - Connexion valide

**Préconditions** :
- Navigateur à jour
- Application démarrée sur http://localhost:4200

**Étapes** :
1. Accéder à http://localhost:4200/login
2. Remplir email: `chef@example.com`
3. Remplir mot de passe: `password123`
4. Cliquer sur "Se Connecter"

**Résultat attendu** :
- ✅ Redirection vers le dashboard
- ✅ Utilisateur affiché dans le navbar
- ✅ Données sauvegardées en localStorage

**Résultat réel** :
- [ ] À tester

### Scénario 1.2 - Déconnexion

**Préconditions** :
- Utilisateur connecté et sur le dashboard

**Étapes** :
1. Cliquer sur "Déconnexion" dans le navbar
2. Observer le comportement

**Résultat attendu** :
- ✅ Retour à la page de connexion
- ✅ localStorage['user'] est vide
- ✅ Impossible d'accéder au dashboard sans se reconnecter

**Résultat réel** :
- [ ] À tester

---

## 📊 Cas de Test 2: Dashboard

### Scénario 2.1 - Affichage des statistiques

**Préconditions** :
- Utilisateur connecté

**Étapes** :
1. Accéder au dashboard
2. Observer les cartes de statistiques

**Résultat attendu** :
- ✅ Affichage du nombre total de projets
- ✅ Affichage du nombre de projets "En cours"
- ✅ Affichage du nombre de projets "Terminés"
- ✅ Affichage du nombre de projets "Planification"

**Résultat réel** :
- [ ] À tester

### Scénario 2.2 - Affichage des projets récents

**Préconditions** :
- Utilisateur connecté
- Au moins 2 projets dans la base

**Étapes** :
1. Consulter la section "Projets Récents"
2. Vérifier les informations affichées

**Résultat attendu** :
- ✅ Affichage des 5 derniers projets maximum
- ✅ Chaque projet affiche : nom, description, statut, échéance
- ✅ Boutons "Modifier" et "Suivis" disponibles

**Résultat réel** :
- [ ] À tester

---

## 📁 Cas de Test 3: Gestion des Projets

### Scénario 3.1 - Liste des projets

**Préconditions** :
- Utilisateur connecté

**Étapes** :
1. Cliquer sur "Mes Projets" dans le navbar
2. Observer la page

**Résultat attendu** :
- ✅ Tableau contenant tous les projets
- ✅ Colonnes : Nom, Description, Statut, Échéance, Actions
- ✅ Bouton "+ Nouveau Projet" visible

**Résultat réel** :
- [ ] À tester

### Scénario 3.2 - Recherche de projets

**Préconditions** :
- Page projects chargée
- Au moins 3 projets existants

**Étapes** :
1. Taper "Site" dans la barre de recherche
2. Observer les résultats

**Résultat attendu** :
- ✅ Filtrage en temps réel
- ✅ Affichage uniquement des projets contenant "Site" dans le nom ou description
- ✅ Si aucun résultat, afficher "Aucun projet trouvé"

**Résultat réel** :
- [ ] À tester

### Scénario 3.3 - Filtrage par statut

**Préconditions** :
- Page projects chargée
- Projets avec différents statuts

**Étapes** :
1. Cliquer sur le bouton "En cours"
2. Observer les résultats

**Résultat attendu** :
- ✅ Affichage uniquement des projets avec le statut "En cours"
- ✅ Bouton est mis en évidence
- ✅ Comptage correct affiché

**Résultat réel** :
- [ ] À tester

### Scénario 3.4 - Créer un nouveau projet

**Préconditions** :
- Page projects chargée

**Étapes** :
1. Cliquer sur "+ Nouveau Projet"
2. Remplir le formulaire :
   - Nom: "Application Mobile"
   - Description: "Développement d'une application mobile pour iOS et Android"
   - Statut: "Planification"
   - Échéance: "2026-06-30"
3. Cliquer sur "Créer"

**Résultat attendu** :
- ✅ Validation des champs minimum requis
- ✅ Redirection vers la liste des projets
- ✅ Nouveau projet visible dans la liste
- ✅ Données sauvegardées en localStorage

**Résultat réel** :
- [ ] À tester

### Scénario 3.5 - Créer un projet avec validation échouée

**Préconditions** :
- Page projet/new chargée

**Étapes** :
1. Laisser le champ "Nom" vide
2. Remplir description: "Test"
3. Cliquer sur "Créer"

**Résultat attendu** :
- ✅ Message d'erreur : "Le nom est requis"
- ✅ Message d'erreur : "La description doit contenir au moins 10 caractères"
- ✅ Formulaire non soumis
- ✅ Rester sur la page du formulaire

**Résultat réel** :
- [ ] À tester

### Scénario 3.6 - Modifier un projet

**Préconditions** :
- Page projects chargée
- Au moins un projet existant

**Étapes** :
1. Cliquer sur "Modifier" pour le projet "Site Web E-commerce"
2. Changer le statut en "En cours"
3. Cliquer sur "Mettre à jour"

**Résultat attendu** :
- ✅ Formulaire pré-rempli avec les données du projet
- ✅ Changement de statut appliqué
- ✅ Redirection vers la liste
- ✅ Modification visible dans la liste

**Résultat réel** :
- [ ] À tester

### Scénario 3.7 - Supprimer un projet

**Préconditions** :
- Page projects chargée

**Étapes** :
1. Cliquer sur "Supprimer" pour un projet
2. Confirmer la suppression

**Résultat attendu** :
- ✅ Confirmation de suppression
- ✅ Projet supprimé de la liste
- ✅ Projet supprimé de localStorage

**Résultat réel** :
- [ ] À tester

---

## 📝 Cas de Test 4: Gestion des Suivis

### Scénario 4.1 - Affichage des suivis d'un projet

**Préconditions** :
- Utilisateur connecté
- Au moins un projet avec des suivis

**Étapes** :
1. Cliquer sur "Suivis" pour le projet "Site Web E-commerce"
2. Observer la page

**Résultat attendu** :
- ✅ Breadcrumb visible : Mes Projets > Site Web E-commerce
- ✅ Infos du projet affichées (statut, échéance, description)
- ✅ Liste des suivis avec :
  - Titre et date de mise à jour
  - Description
  - Barre de progression (avec couleur appropriée)
  - Problèmes et décisions
- ✅ Bouton "+ Nouveau Suivi" visible

**Résultat réel** :
- [ ] À tester

### Scénario 4.2 - Créer un nouveau suivi

**Préconditions** :
- Page followups chargée pour un projet

**Étapes** :
1. Cliquer sur "+ Nouveau Suivi"
2. Remplir :
   - Titre: "Intégration des APIs"
   - Description: "Mise en place de l'intégration avec les services externes. Configuration des endpoints, tests des connexions."
   - Avancement: 65%
   - Problèmes: "Latence réseau détectée"
   - Décisions: "Utilisation d'un CDN pour optimiser"
3. Cliquer sur "Créer"

**Résultat attendu** :
- ✅ Validation des champs obligatoires
- ✅ Barre de progression affichée correctement (couleur orange pour 65%)
- ✅ Redirection vers la liste des suivis
- ✅ Nouveau suivi visible dans la liste
- ✅ Données sauvegardées en localStorage

**Résultat réel** :
- [ ] À tester

### Scénario 4.3 - Validation du formulaire suivi

**Préconditions** :
- Page followup/new chargée

**Étapes** :
1. Laisser le titre vide
2. Remplir description: "Court"
3. Cliquer sur "Créer"

**Résultat attendu** :
- ✅ Erreur: "Le titre est requis"
- ✅ Erreur: "La description doit contenir au moins 20 caractères"
- ✅ Formulaire non soumis

**Résultat réel** :
- [ ] À tester

### Scénario 4.4 - Modifier un suivi

**Préconditions** :
- Page followups chargée
- Au moins un suivi existant

**Étapes** :
1. Cliquer sur "Modifier" pour un suivi
2. Augmenter l'avancement à 85%
3. Cliquer sur "Mettre à jour"

**Résultat attendu** :
- ✅ Formulaire pré-rempli
- ✅ Avancement changé à 85%
- ✅ Couleur de la barre change en vert
- ✅ Redirection et modification visible

**Résultat réel** :
- [ ] À tester

### Scénario 4.5 - Supprimer un suivi

**Préconditions** :
- Page followups chargée

**Étapes** :
1. Cliquer sur "Supprimer" pour un suivi
2. Confirmer la suppression

**Résultat attendu** :
- ✅ Confirmation demandée
- ✅ Suivi supprimé
- ✅ Page mise à jour

**Résultat réel** :
- [ ] À tester

---

## 🎨 Cas de Test 5: Interface et Responsive

### Scénario 5.1 - Responsive sur mobile

**Préconditions** :
- Outils de développement ouverts
- Viewport mobile (375x667)

**Étapes** :
1. Naviguer entre les pages principales
2. Tester les boutons et formulaires
3. Vérifier la lisibilité

**Résultat attendu** :
- ✅ Tous les éléments visibles sans scroll horizontal excessif
- ✅ Boutons facilement cliquables
- ✅ Tableau scrollable horizontalement si nécessaire
- ✅ Formulaires lisibles

**Résultat réel** :
- [ ] À tester

### Scénario 5.2 - Codes couleurs des statuts

**Préconditions** :
- Page projects ou dashboard

**Étapes** :
1. Observer les badges de statut
2. Vérifier les couleurs pour chaque statut

**Résultat attendu** :
- ✅ Planification: Bleu clair
- ✅ En cours: Jaune
- ✅ Terminé: Vert
- ✅ Suspendu: Rouge

**Résultat réel** :
- [ ] À tester

### Scénario 5.3 - Codes couleurs de progression

**Préconditions** :
- Page followups avec plusieurs suivis

**Étapes** :
1. Observer les barres de progression
2. Créer un suivi à 30%
3. Créer un suivi à 70%
4. Créer un suivi à 90%

**Résultat attendu** :
- ✅ 30%: Rouge
- ✅ 70%: Orange
- ✅ 90%: Vert

**Résultat réel** :
- [ ] À tester

---

## 🔄 Cas de Test 6: Navigation et Flux

### Scénario 6.1 - Navigation complète

**Préconditions** :
- Utilisateur connecté

**Étapes** :
1. Dashboard → Cliquer "Mes Projets"
2. Cliquer sur "Suivis" pour un projet
3. Cliquer sur "Retour aux projets"
4. Cliquer sur le projet du breadcrumb

**Résultat attendu** :
- ✅ Navigation fluide sans erreurs
- ✅ Données persistantes
- ✅ Breadcrumbs corrects

**Résultat réel** :
- [ ] À tester

### Scénario 6.2 - Accès direct par URL

**Préconditions** :
- Utilisateur connecté

**Étapes** :
1. Taper directement: http://localhost:4200/projects
2. Taper directement: http://localhost:4200/projects/1/followups

**Résultat attendu** :
- ✅ Pages chargées correctement
- ✅ Contenu approprié affiché

**Résultat réel** :
- [ ] À tester

---

## 📊 Cas de Test 7: Persistance des Données

### Scénario 7.1 - localStorage

**Préconditions** :
- Utilisateur connecté et a créé un projet

**Étapes** :
1. Ouvrir les DevTools (F12)
2. Aller dans Application → localStorage
3. Chercher la clé 'projects'

**Résultat attendu** :
- ✅ localStorage['projects'] contient les projets
- ✅ localStorage['user'] contient l'utilisateur
- ✅ localStorage['followups'] contient les suivis

**Résultat réel** :
- [ ] À tester

### Scénario 7.2 - Rafraîchissement de page

**Préconditions** :
- Utilisateur connecté avec données en localStorage

**Étapes** :
1. Créer un projet
2. Appuyer sur F5 pour rafraîchir
3. Observer si les données sont toujours présentes

**Résultat attendu** :
- ✅ Projet toujours visible
- ✅ Utilisateur toujours connecté
- ✅ Pas de perte de données

**Résultat réel** :
- [ ] À tester

---

## 🎯 Checklist de Validation Finale

- [ ] Authentification fonctionne
- [ ] Dashboard affiche les bonnes statistiques
- [ ] Projets: CRUD complet fonctionnel
- [ ] Recherche et filtrage des projets
- [ ] Formulaires de projets valident correctement
- [ ] Suivis: CRUD complet fonctionnel
- [ ] Barres de progression affichées correctement
- [ ] Design responsive sur tous les écrans
- [ ] Navigation fluide entre les pages
- [ ] Données persistantes après rafraîchissement
- [ ] Messages d'erreur clairs
- [ ] Boutons intuitifs et accessibles
- [ ] Navbar toujours visible et fonctionnelle
- [ ] Déconnexion fonctionne correctement

---

## 📝 Notes pour les Développeurs

- Les tests peuvent être automatisés avec Jasmine/Karma
- Ajouter des tests E2E avec Cypress
- Valider la performance avec Lighthouse
- Vérifier l'accessibilité (WCAG 2.1)
- Tests d'intégration avec un vrai backend

---

**Généré le : 2026-02-09**
