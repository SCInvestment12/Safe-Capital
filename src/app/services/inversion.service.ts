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

@Injectable({ providedIn: 'root' })
export class InversionService {
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/inversiones';

  constructor(private http: HttpClient) {}

  crearInversion(req: CrearInversionRequest): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, req, { headers });
  }

  obtenerInversionesDeUsuario(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuario/${id}`);
  }
}
