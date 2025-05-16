// src/app/app.routes.ts
import { Routes } from '@angular/router';

import { HomePageComponent } from './components/home-page.component';
import { LoginPageComponent } from './components/login-page.component';
import { RegisterPageComponent } from './components/register-page.component';
import { PerfilComponent } from './components/perfil.component';
import { DashboardComponent } from './components/dashboard.component';
import { NotFoundComponent } from './not-found.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';

import { RoleGuard } from './guards/role.guard';
import { DashboardRedirectGuard } from './guards/dashboard-redirect.guard';
import { DashboardRedirectComponent } from './components/dashboard-redirect/dashboard-redirect.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'perfil', component: PerfilComponent },

  // /dashboard redirige al sub-dashboard según rol
  {
    path: 'dashboard',
    component: DashboardRedirectComponent,
    canActivate: [DashboardRedirectGuard]
  },

  // Sub-dashboards protegidos
  {
    path: 'dashboard/user',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'ROLE_USER' }
  },
  {
    path: 'dashboard/moderator',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'ROLE_MODERATOR' }
  },
  {
    path: 'dashboard/admin',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'dashboard/super-admin',
    component: DashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'ROLE_SUPER_ADMIN' }
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'SUPER_ADMIN'] }
  },

  // Wildcard 404
  { path: '**', component: NotFoundComponent }
];
