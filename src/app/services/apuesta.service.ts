// src/app/services/apuesta.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearApuestaRequest {
  idUsuario: number;                // ✅ Agregado para enviar al backend
  simbolo: string;
  tipo: string;
  direccion: 'up' | 'down';
  monto: number;
  plazo: number;
  precioActual: number;            // ✅ Asegúrate de enviarlo también si el backend lo usa
}

@Injectable({ providedIn: 'root' })
export class ApuestaService {
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/apuestas';

  constructor(private http: HttpClient) {}

  crearApuesta(dto: CrearApuestaRequest): Observable<string> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(this.baseUrl, dto, { headers, responseType: 'text' });
  }
}
