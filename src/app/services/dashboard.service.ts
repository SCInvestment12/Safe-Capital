import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTOs front-end
export interface AccountOperation {
  amount: number;
  method: string;
  termDays: number;
}

export interface Transaction {
  id: number;
  amount: number;
  method: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  termDays: number;
  timestamp: string;
}

// Request para retirar saldo
export interface RetirarSaldoRequest {
  monto: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Ajusta esta URL si tu API corre en otro host/puerto
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/usuarios';

  constructor(private http: HttpClient) {}

  // Cabeceras con JWT
  private authHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) };
  }

  //  Obtener saldo
  getBalance(): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/saldo`,
      this.authHeaders()
    );
  }

  //  Hacer depósito (sin cambios)
  deposit(userId: number, dto: AccountOperation): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/${userId}/deposit`,
      dto,
      this.authHeaders()
    );
  }

  //  Hacer retiro de inversión
  withdraw(dto: RetirarSaldoRequest): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/saldo/retirar`,
      dto,
      this.authHeaders()
    );
  }

  //  Traer historial (sin cambios)
  getTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/${userId}/transactions`,
      this.authHeaders()
    );
  }
}
