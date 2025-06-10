import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, map, startWith } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ForexService {
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/forex';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // ✅ Obtener precio base real desde el backend
  getPrecioBase(par: string): Observable<number> {
    const cleanPar = par.replace('/', '').toUpperCase(); // "EUR/USD" -> "EURUSD"
    return this.http.get<number>(`${this.baseUrl}/precio?par=${cleanPar}`, { headers: this.headers });
  }

  // ✅ Simular fluctuaciones a partir del precio base
  getPrecioSimulado(par: string): Observable<number> {
    return this.getPrecioBase(par).pipe(
  switchMap(base =>
    interval(3000).pipe(
      startWith(0),
      map(() => {
        const variacion = (Math.random() - 0.5) * 0.002;
        return parseFloat((base + variacion).toFixed(4));
      })
    )
  )
);
  }
}
