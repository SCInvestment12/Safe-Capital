import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.rol;

      const expectedRoles: string[] = Array.isArray(route.data['roles'])
        ? route.data['roles']
        : [route.data['role']];

      if (expectedRoles.includes(userRole)) {
        return true;
      }

      // Rol no permitido
      this.router.navigate(['/login']);
      return false;
    } catch (error) {
      console.error('Error al validar token:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}
