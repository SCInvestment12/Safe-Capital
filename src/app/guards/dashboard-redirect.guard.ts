// src/app/guards/dashboard-redirect.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class DashboardRedirectGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const role = this.auth.getUserRole();

    switch (role) {
      case 'ROLE_USER':
        this.router.navigate(['/dashboard/user']);
        break;
      case 'ROLE_MODERATOR':
        this.router.navigate(['/dashboard/moderator']);
        break;
      case 'ROLE_ADMIN':
        this.router.navigate(['/dashboard/admin']);
        break;
      case 'ROLE_SUPER_ADMIN':
        this.router.navigate(['/dashboard/super-admin']);
        break;
      default:
        // si no está logueado, al login
        this.router.navigate(['/login']);
        break;
    }

    // Siempre devolvemos false porque ya hemos hecho el redirect
    return false;
  }
}
