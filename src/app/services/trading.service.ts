import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TradingBarDTO {
  timestamp: string;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TradingService {
  private apiUrl = 'https://safe-capital-backend.onrender.com/api/trading';

  constructor(private http: HttpClient) {}

  // ✅ Obtener datos para la gráfica según el tipo y símbolo
  getBarsByTipoYSimbolo(tipo: string, simbolo: string): Observable<TradingBarDTO[]> {
    if (tipo === 'forex') {
      return this.getBarsForex(simbolo);
    }
    return this.http.get<TradingBarDTO[]>(`${this.apiUrl}/bars/${tipo}/${simbolo}`);
  }

  // ✅ Obtener datos de Forex
  getBarsForex(symbol: string): Observable<TradingBarDTO[]> {
    return this.http.get<TradingBarDTO[]>(`${this.apiUrl}/forex/bars/${symbol}`);
  }

  // ✅ (Si implementas los Top 5 en el backend)
  getTop5(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top5/${tipo}`);
  }
}
