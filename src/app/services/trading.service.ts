import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TradingBarDTO {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

@Injectable({
  providedIn: 'root'
})
export class TradingService {
  private apiUrl = 'https://safe-capital-backend.onrender.com/api/trading'; // Cambia a tu dominio si es necesario

  constructor(private http: HttpClient) {}

  getBarsByTipo(tipo: string): Observable<TradingBarDTO[]> {
    return this.http.get<TradingBarDTO[]>(`${this.apiUrl}/bars/${tipo}`);
  }

  getTop5(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/activos/top5/${tipo}`);
  }
  
}
