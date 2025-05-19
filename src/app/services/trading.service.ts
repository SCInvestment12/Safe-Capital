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
  private apiUrl = 'https://safe-capital-backend.onrender.com/api';

  constructor(private http: HttpClient) {}

  /**
   * 🔀 Decide internamente si es forex o no
   */
  getBarsByTipoYSimbolo(tipo: string, simbolo: string): Observable<TradingBarDTO[]> {
    if (tipo === 'forex') {
      // EUR/USD → EURUSD
      const cleanSymbol = simbolo.replace('/', '');
      return this.getBarsForex(cleanSymbol);
    }
    // CETES, ETFs, Cripto o Acciones
    return this.http.get<TradingBarDTO[]>(
      `${this.apiUrl}/trading/bars/${tipo}/${simbolo}`
    );
  }

  /**
   * 🔓 Forex (usa ruta /api/forex)
   */
  getBarsForex(symbol: string): Observable<TradingBarDTO[]> {
    return this.http.get<TradingBarDTO[]>(
      `${this.apiUrl}/forex/bars/${symbol}`
    );
  }

  /**
   * Top 5 por tipo de activo
   */
  getTop5(tipo: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/trading/top5/${tipo}`
    );
  }
}
