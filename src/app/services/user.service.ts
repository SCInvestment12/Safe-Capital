import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerPerfil(): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/perfil`, { headers });
  }

  actualizarPerfil(datos: any): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    return this.http.put(`${this.baseUrl}/perfil`, datos, { headers });
  }

  obtenerSaldo(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/saldo`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  acreditarSaldo(correo: string, monto: number): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.baseUrl}/saldo/acreditar`, { correoElectronico: correo, monto }, { headers });
  }

  obtenerMovimientos(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>('https://safe-capital-backend.onrender.com/api/movimientos', { headers });
  }
}
