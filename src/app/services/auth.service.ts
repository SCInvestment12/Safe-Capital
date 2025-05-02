// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private base = 'https://safe-capital-backend.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.base}/register`, user);
  }

  login(correoElectronico: string, contrasena: string): Observable<string> {
    return this.http.post(`${this.base}/login`, { correoElectronico, contrasena }, { responseType: 'text' }).pipe(
      tap(token => {
        localStorage.setItem('token', token);  // ✅ Guarda el token plano
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol || '';
    } catch (e) {
      return '';
    }
  }
  getSaldo(): Observable<number> {
    const token = this.getToken();
    return this.http.get<number>('https://safe-capital-backend.onrender.com/api/auth/saldo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
}
