// src/app/services/saldo.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DashboardService } from './dashboard.service';

@Injectable({ providedIn: 'root' })
export class SaldoService {
  private saldo$ = new BehaviorSubject<number>(0);

  constructor(private dashboardService: DashboardService) {}

  cargarSaldo(): void {
    this.dashboardService.getBalance().subscribe({
      next: saldo => this.saldo$.next(saldo),
      error: () => this.saldo$.next(0)
    });
  }

  actualizarSaldo(valor: number): void {
    this.saldo$.next(valor);
  }

  obtenerSaldo(): Observable<number> {
    return this.saldo$.asObservable();
  }
}
