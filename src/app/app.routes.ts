import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page.component';
import { LoginPageComponent } from './components/login-page.component';
import { RegisterPageComponent } from './components/register-page.component';
import { DashboardComponent } from './components/dashboard.component'; // ✅ Asegúrate de que esta línea esté

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'dashboard', component: DashboardComponent }, // ✅ Aquí debe estar bien declarado
  { path: '**', redirectTo: '' }
];
