// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Ajusta esta URL si tu API corre en otro host/puerto
  private baseUrl = 'https://safe-capital-backend.onrender.com/api/account';

  constructor(private http: HttpClient) {}

  //  Obtener saldo
  getBalance(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${userId}/balance`);
  }

  //  Hacer depósito
  deposit(userId: number, dto: AccountOperation): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/${userId}/deposit`,
      dto
    );
  }

  //  Hacer retiro
  withdraw(userId: number, dto: AccountOperation): Observable<Transaction> {
    return this.http.post<Transaction>(
      `${this.baseUrl}/${userId}/withdraw`,
      dto
    );
  }

  //  Traer historial
  getTransactions(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.baseUrl}/${userId}/transactions`
    );
  }
}
