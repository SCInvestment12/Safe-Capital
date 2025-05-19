import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: ''
})
export class DashboardRedirectComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.rol;

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
          this.router.navigate(['/login']);
      }
    } catch (e) {
      this.router.navigate(['/login']);
    }
  }
}
