import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearInversionRequest {
  idUsuario: number;
  tipo: string;
  simbolo: string;
  monto: number;
  plazoDias: number;
}

export interface CrearApuestaRequest {
  simbolo: string;
  tipo: string;
  direccion: string;
  monto: number;
  plazo: number;
}

@Injectable({ providedIn: 'root' })
export class InversionService {
  private inversionUrl = 'https://safe-capital-backend.onrender.com/api/inversiones';
  private apuestasUrl = 'https://safe-capital-backend.onrender.com/api/apuestas';
  private movimientosUrl = 'https://safe-capital-backend.onrender.com/api/movimientos';

  constructor(private http: HttpClient) {}

  crearInversion(req: CrearInversionRequest): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.inversionUrl, req, { headers });
  }

  crearApuesta(req: CrearApuestaRequest): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.apuestasUrl, req, { headers });
  }

  obtenerInversionesDeUsuario(id: number): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.inversionUrl}/usuario/${id}`, { headers });
  }

  obtenerMovimientos(): Observable<any[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(this.movimientosUrl, { headers });
  }
}
