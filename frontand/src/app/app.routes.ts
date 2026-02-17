import { Routes } from '@angular/router';
import { Login } from './core/features/login/login';
import { Register } from './core/features/register/register';
import { ChefDashboard } from './core/features/chef/dashboard/chef-dashboard/chef-dashboard';
import { Projects } from './core/features/chef/projects/projects/projects';
import { ProjectForm } from './core/features/chef/projects/project-form/project-form';
import { Followups } from './core/features/chef/followups/followups/followups';
import { FollowupForm } from './core/features/chef/followups/followup-form/followup-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
 {
    path: '',
    redirectTo: 'login',  
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: ChefDashboard
  },
  {
    path: 'projects',
    component: Projects
  },
  {
    path: 'projects/new',
    component: ProjectForm
  },
  {
    path: 'projects/:id/edit',
    component: ProjectForm
  },
  {
    path: 'projects/:projectId/followups',
    component: Followups
  },
  {
    path: 'projects/:projectId/followups/new',
    component: FollowupForm
  },
  {
    path: 'projects/:projectId/followups/:followupId/edit',
    component: FollowupForm
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];


