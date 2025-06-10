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
  type: 'DEPOSIT' | 'WITHDRAW' | 'Inversión';
  termDays: number;
  timestamp: string;
}

// Request para retirar saldo
export interface RetirarSaldoRequest {
  monto: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/usuarios';

  constructor(private http: HttpClient) {}

  // Cabeceras con JWT
  private authHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) };
  }

  // Obtener saldo actual
  getBalance(): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/saldo`,
      this.authHeaders()
    );
  }

  // Hacer depósito (no cambia)
  deposit(userId: number, dto: AccountOperation): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/${userId}/deposit`,
      dto,
      this.authHeaders()
    );
  }

  // Hacer retiro de inversión
  withdraw(dto: RetirarSaldoRequest): Observable<string> {
    return this.http.post<string>(
      `${this.baseUrl}/saldo/retirar`,
      dto,
      this.authHeaders()
    );
  }

  // Obtener historial de transacciones (depósitos, retiros, inversiones)
  getTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/${userId}/transactions`,
      this.authHeaders()
    );
  }
}
