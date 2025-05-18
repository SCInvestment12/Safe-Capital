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
    const payload = {
      nombre: user.nombre,
      apellidos: user.apellido,
      curp: user.curp,
      fechaNacimiento: this.convertirFecha(user.fechaNacimiento),
      telefono: user.telefono,
      correoElectronico: user.email,
      contrasena: user.password
    };

    return this.http.post(`${this.base}/register`, payload);
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
    return this.http.get<number>(`${this.base}/saldo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private convertirFecha(fecha: string): string {
    const parsed = new Date(fecha);
    const yyyy = parsed.getFullYear();
    const mm = ('0' + (parsed.getMonth() + 1)).slice(-2);
    const dd = ('0' + parsed.getDate()).slice(-2);
    return `${yyyy}-${mm}-${dd}`;
  }
}
