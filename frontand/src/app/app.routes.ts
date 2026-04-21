import { Routes } from '@angular/router';
import { Login } from './core/features/login/login';
import { ChefDashboard } from './core/features/chef/dashboard/chef-dashboard/chef-dashboard';
import { Projects } from './core/features/chef/projects/projects/projects';
import { ProjectForm } from './core/features/chef/projects/project-form/project-form';
import { Followups } from './core/features/chef/followups/followups/followups';
import { FollowupForm } from './core/features/chef/followups/followup-form/followup-form';
import { PiloteSuiviProjets } from './core/features/pilote/suivi-projets/pilote-suivi-projets';
import { AdminUsers } from './core/features/admin/users/admin-users';
import { AdminUserCreate } from './core/features/admin/users/admin-user-create/admin-user-create';
import { AdminUserEdit } from './core/features/admin/users/admin-user-edit/admin-user-edit';
import { AdminNomenclatures } from './core/features/admin/nomenclatures/admin-nomenclatures';
import { NotificationsHistoriqueComponent } from './core/features/notifications/notifications-historique/notifications-historique';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { piloteGuard } from './core/guards/pilote.guard';
import { piloteAdminGuard } from './core/guards/pilote-admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: ChefDashboard,
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    component: Projects,
    canActivate: [authGuard]
  },
  {
    path: 'suivi-projets',
    component: PiloteSuiviProjets,
    canActivate: [authGuard, piloteGuard]
  },
  {
    path: 'notifications',
    component: NotificationsHistoriqueComponent,
    canActivate: [authGuard, piloteAdminGuard]
  },
  {
    path: 'projects/new',
    component: ProjectForm,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:id/edit',
    component: ProjectForm,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/followups',
    component: Followups,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/followups/new',
    component: FollowupForm,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:projectId/followups/:followupId/edit',
    component: FollowupForm,
    canActivate: [authGuard]
  },
  {
    path: 'admin/users/create',
    component: AdminUserCreate,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/users/edit/:id',
    component: AdminUserEdit,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/users',
    component: AdminUsers,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/nomenclatures',
    component: AdminNomenclatures,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

