# Architecture - Gestion de Projets Chef de Projet

## Vue d'ensemble

L'application suit une architecture **composant-service** utilisant Angular 20 avec des composants standalone et des services injectables.

## Diagramme de l'Application

```
┌─────────────────────────────────────────────────────────────┐
│                    Application App                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    Navbar (Partagé)                    │ │
│  │  - Navigation vers Dashboard/Projets                   │ │
│  │  - Affichage utilisateur + Déconnexion                │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │            Contenu Principal (Router Outlet)           │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │           Login (Page de Connexion)              │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  ChefDashboard                                   │ │ │
│  │  │  - Statistiques projets                          │ │ │
│  │  │  - Projets récents                               │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Projects List                                   │ │ │
│  │  │  - Tableau des projets                           │ │ │
│  │  │  - Recherche et filtrage                         │ │ │
│  │  │  - Actions CRUD                                  │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  ProjectForm                                     │ │ │
│  │  │  - Création/Edition de projet                   │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Followups List                                  │ │ │
│  │  │  - Liste des suivis d'un projet                 │ │ │
│  │  │  - Barres de progression                         │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  FollowupForm                                    │ │ │
│  │  │  - Création/Edition de suivi                    │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    ┌─────────┴──────────┐
                    │                    │
             ┌──────▼──────┐    ┌────────▼────────┐
             │    Auth     │    │  ProjectService │
             │   Service   │    │                 │
             └─────────────┘    └────────┬────────┘
                    │                    │
                    │            ┌───────▼────────┐
                    │            │ FollowupService│
                    │            └────────────────┘
                    │
            ┌───────▼────────┐
            │  localStorage  │
            └────────────────┘
```

## Services

### 1. **Auth Service** (`auth.ts`)

**Responsabilités** :
- Gestion de l'authentification utilisateur
- Gestion de la session (login/logout)
- Stockage des données utilisateur
- Vérification du statut d'authentification

**Interfaces** :
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'chef' | 'admin' | 'employee';
}
```

**Méthodes** :
- `login(email: string, password: string): void`
- `logout(): void`
- `getCurrentUser(): User | null`
- `isLoggedIn(): boolean`

**Stockage** : localStorage → `user`

### 2. **ProjectService** (`project.ts`)

**Responsabilités** :
- Gestion complète des projets (CRUD)
- Gestion du projet courant
- Calcul des statistiques
- Persistance des données

**Interfaces** :
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planification' | 'en-cours' | 'termine' | 'suspendu';
  dueDate: Date;
  createdAt: Date;
  chefId: string;
}
```

**Méthodes** :
- `getProjects(): Project[]`
- `getProjectById(id: string): Project | undefined`
- `createProject(project: Omit<Project, 'id' | 'createdAt'>): Project`
- `updateProject(id: string, updates: Partial<Project>): Project | null`
- `deleteProject(id: string): void`
- `setCurrentProject(project: Project | null): void`
- `getCurrentProject(): Project | null`
- `getProjectsStats(): { total, enCours, termines, planification }`

**Stockage** : localStorage → `projects`

### 3. **FollowupService** (`followup.ts`)

**Responsabilités** :
- Gestion complète des suivis (CRUD)
- Filtrage des suivis par projet
- Persistance des données

**Interfaces** :
```typescript
interface Followup {
  id: string;
  projectId: string;
  title: string;
  description: string;
  progress: number;
  issues: string;
  decisions: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Méthodes** :
- `getFollowups(): Followup[]`
- `getFollowupsByProject(projectId: string): Followup[]`
- `getFollowupById(id: string): Followup | undefined`
- `createFollowup(followup: Omit<Followup, 'id' | 'createdAt' | 'updatedAt'>): Followup`
- `updateFollowup(id: string, updates: Partial<Followup>): Followup | null`
- `deleteFollowup(id: string): void`

**Stockage** : localStorage → `followups`

## Composants

### Structure Hiérarchique

```
App (Composant racine)
├── Navbar (Partagé)
│   ├── Liens de navigation
│   ├── Affichage utilisateur
│   └── Bouton déconnexion
│
└── Contenu Principal (Router Outlet)
    ├── Login
    ├── ChefDashboard
    ├── Projects (Liste)
    ├── ProjectForm (Création/Édition)
    ├── Followups (Liste)
    └── FollowupForm (Création/Édition)
```

### Détail des Composants

#### **Login** (`core/features/login/`)
- **Responsabilité** : Page d'authentification
- **Inputs** : Aucun
- **Outputs** : Redirection après connexion
- **Services utilisés** : Auth
- **État** : email, password, submitted, error

#### **Navbar** (`shared/navbar/`)
- **Responsabilité** : Navigation principale et affichage utilisateur
- **Inputs** : Aucun
- **Outputs** : Navigation et déconnexion
- **Services utilisés** : Auth
- **Affiche** : Nom utilisateur, boutons de navigation, bouton déconnexion

#### **ChefDashboard** (`core/features/chef/dashboard/`)
- **Responsabilité** : Vue d'ensemble avec statistiques
- **Inputs** : Aucun
- **Outputs** : Navigation vers autres pages
- **Services utilisés** : ProjectService
- **Affiche** :
  - Cartes de statistiques (total, en cours, terminés, planification)
  - Liste des projets récents
  - Boutons d'action rapide

#### **Projects** (`core/features/chef/projects/projects/`)
- **Responsabilité** : Gestion et affichage de la liste des projets
- **Inputs** : Aucun
- **Outputs** : Navigation vers formulaire et suivis
- **Services utilisés** : ProjectService
- **Fonctionnalités** :
  - Tableau des projets
  - Recherche en temps réel
  - Filtrage par statut
  - Actions CRUD

#### **ProjectForm** (`core/features/chef/projects/project-form/`)
- **Responsabilité** : Création et édition de projets
- **Inputs** : Paramètre route `id` (optionnel)
- **Outputs** : Redirection après soumission
- **Services utilisés** : ProjectService, ActivatedRoute, Router
- **Champs** : name, description, status, dueDate
- **Validations** :
  - name : required, minlength(3)
  - description : required, minlength(10)
  - status : required
  - dueDate : required

#### **Followups** (`core/features/chef/followups/followups/`)
- **Responsabilité** : Affichage de la liste des suivis d'un projet
- **Inputs** : Paramètre route `projectId`
- **Outputs** : Navigation vers formulaire et actions
- **Services utilisés** : ProjectService, FollowupService
- **Affiche** :
  - Infos du projet
  - Liste des suivis avec barres de progression
  - Actions sur les suivis

#### **FollowupForm** (`core/features/chef/followups/followup-form/`)
- **Responsabilité** : Création et édition de suivis
- **Inputs** : Paramètres route `projectId`, `followupId` (optionnel)
- **Outputs** : Redirection après soumission
- **Services utilisés** : ProjectService, FollowupService, ActivatedRoute, Router
- **Champs** : title, description, progress, issues, decisions
- **Validations** :
  - title : required, minlength(5)
  - description : required, minlength(20)
  - progress : required, min(0), max(100)
  - issues : optionnel
  - decisions : optionnel

## Flux de Données

### Authentification
```
Utilisateur → Login Form
                ↓
           Auth Service (login)
                ↓
        localStorage (save user)
                ↓
        Navigate to Dashboard
```

### Création de Projet
```
Utilisateur → ProjectForm
                ↓
       Form Validation
                ↓
       ProjectService.createProject()
                ↓
       localStorage (save project)
                ↓
       Navigate to Projects List
```

### Affichage des Suivis
```
Utilisateur clique "Voir Suivis"
                ↓
        Route change to /projects/:id/followups
                ↓
    Followups Component (OnInit)
                ↓
    ProjectService.getProjectById() → Afficher infos
    FollowupService.getFollowupsByProject() → Afficher suivis
```

## Gestion de l'État

L'application utilise Angular Signals pour l'état réactif :

```typescript
// Auth Service
private currentUser = signal<User | null>(null);
private isAuthenticated = signal(false);

// ProjectService
private projects = signal<Project[]>([]);
private currentProject = signal<Project | null>(null);

// FollowupService
private followups = signal<Followup[]>([]);
```

## Routage

### Configuration des Routes

```typescript
routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: ChefDashboard },
  { path: 'projects', component: Projects },
  { path: 'projects/new', component: ProjectForm },
  { path: 'projects/:id/edit', component: ProjectForm },
  { path: 'projects/:projectId/followups', component: Followups },
  { path: 'projects/:projectId/followups/new', component: FollowupForm },
  { path: 'projects/:projectId/followups/:followupId/edit', component: FollowupForm },
  { path: '**', redirectTo: 'dashboard' }
];
```

## Persistance des Données

### localStorage Schema

```json
{
  "user": {
    "id": "1",
    "name": "Chef de Projet",
    "email": "chef@example.com",
    "role": "chef"
  },
  "projects": [
    {
      "id": "1",
      "name": "Projet 1",
      "description": "Description",
      "status": "en-cours",
      "dueDate": "2026-03-31T00:00:00.000Z",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "chefId": "1"
    }
  ],
  "followups": [
    {
      "id": "1",
      "projectId": "1",
      "title": "Suivi 1",
      "description": "Description",
      "progress": 60,
      "issues": "Problèmes",
      "decisions": "Décisions",
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-01-20T00:00:00.000Z"
    }
  ]
}
```

## Injection de Dépendances

Les services sont fournis au niveau `root` :

```typescript
@Injectable({
  providedIn: 'root',
})
export class Auth { ... }

@Injectable({
  providedIn: 'root',
})
export class ProjectService { ... }

@Injectable({
  providedIn: 'root',
})
export class FollowupService { ... }
```

Cela garantit une seule instance partagée entre tous les composants.

## Points d'Extensibilité

### Pour ajouter une API Backend

1. **Remplacer localStorage par HttpClient** :
```typescript
constructor(private http: HttpClient) {}

getProjects(): Observable<Project[]> {
  return this.http.get<Project[]>('/api/projects');
}
```

2. **Gérer les états de chargement** :
```typescript
isLoading = signal(false);
error = signal<string | null>(null);
```

3. **Ajouter une vraie authentification** :
```typescript
login(email: string, password: string): Observable<User> {
  return this.http.post<User>('/api/auth/login', { email, password });
}
```

### Pour ajouter des rôles et permissions

1. **Implémenter un guard** :
```typescript
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}
  
  canActivate(): boolean {
    if (this.auth.isLoggedIn()) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
```

2. **Appliquer à une route** :
```typescript
{ 
  path: 'dashboard', 
  component: ChefDashboard,
  canActivate: [AuthGuard]
}
```

## Optimisations Possibles

1. **Lazy Loading** : Charger les modules des projets à la demande
2. **Change Detection** : Utiliser `OnPush` strategy
3. **Memoization** : Cacher les résultats de fonctions pures
4. **Virtual Scrolling** : Pour les listes avec beaucoup d'éléments
5. **Code Splitting** : Diviser le bundle Angular

---

**Cette architecture est scalable et prête pour l'intégration d'un backend.**
