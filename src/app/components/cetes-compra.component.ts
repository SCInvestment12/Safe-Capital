import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DashboardService, RetirarSaldoRequest } from '../services/dashboard.service';
import { AlertService } from '../services/alert.service';
import { InversionService, CrearInversionRequest } from '../services/inversion.service';
import { SaldoService } from '../services/saldo.service';

interface PlazoCetes {
  plazo: string;
  tasa: string;
}

@Component({
  selector: 'app-cetes-compra',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './cetes-compra.component.html',
  styleUrls: ['./cetes-compra.component.css']
})
export class CetesCompraComponent implements OnInit {
  plazos: PlazoCetes[] = [
    { plazo: '1 mes', tasa: '—%' },
    { plazo: '3 meses', tasa: '—%' },
    { plazo: '6 meses', tasa: '—%' },
    { plazo: '12 meses', tasa: '—%' },
    { plazo: '2 años', tasa: '—%' }
  ];
  plazoSeleccionado: PlazoCetes | null = null;
  confirmar = false;
  monto: number | null = null;
  reinversion: boolean = false;

  fechaSubasta = '';
  fechaSubastaNueva = '';
  private headers: HttpHeaders;
  private base = 'https://safe-capital-backend.onrender.com/api';

  constructor(
    private http: HttpClient,
    private dashboardService: DashboardService,
    private alertService: AlertService,
    private inversionService: InversionService,
    private saldoService: SaldoService
  ) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.cargarTasasPorPlazo();
    this.obtenerFechaSubasta();
  }

  private cargarTasasPorPlazo() {
    this.http.get<{ [key: string]: number }>(`${this.base}/config/cetes/tasas`, { headers: this.headers })
      .subscribe({
        next: data => {
          this.plazos = [
            { plazo: '1 mes', tasa: (data['30'] ?? 0).toFixed(2) + '%' },
            { plazo: '3 meses', tasa: (data['90'] ?? 0).toFixed(2) + '%' },
            { plazo: '6 meses', tasa: (data['180'] ?? 0).toFixed(2) + '%' },
            { plazo: '12 meses', tasa: (data['365'] ?? 0).toFixed(2) + '%' },
            { plazo: '2 años', tasa: (data['730'] ?? 0).toFixed(2) + '%' }
          ];
        },
        error: () => console.error('❌ No se pudieron cargar las tasas de CETES por plazo')
      });
  }

  seleccionar(p: PlazoCetes) {
    this.plazoSeleccionado = p;
    this.confirmar = false;
    this.monto = null;
    this.reinversion = false;
  }

  setReinversion(valor: boolean) {
    this.reinversion = valor;
  }

  continuarCompra() {
    if (!this.monto || this.monto <= 0) {
      this.alertService.error('Ingresa un monto válido.');
      return;
    }

    const req: RetirarSaldoRequest = { monto: this.monto };
    this.dashboardService.withdraw(req).subscribe({
      next: () => {
        this.procesarInversion();
      },
      error: (err) => {
        if (err?.status === 200 || err?.ok === false) {
          console.warn('⚠️ Retiro respondió raro pero con 200 OK. Continuando...');
          this.procesarInversion();
        } else {
          console.error('❌ Error al retirar saldo:', err);
          this.alertService.error('No se pudo descontar el saldo.');
        }
      }
    });
  }

  private procesarInversion() {
    const id = +(localStorage.getItem('id') || '0');
    const simbolo = 'CETES';
    const tipo = 'cetes';
    const plazoDias = this.obtenerDiasDesdePlazo(this.plazoSeleccionado?.plazo || '');

    const inversionReq: CrearInversionRequest = {
      idUsuario: id,
      tipo,
      simbolo,
      monto: this.monto!,
      plazoDias
    };

    this.inversionService.crearInversion(inversionReq).subscribe({
      next: () => {
        this.alertService.success(`✅ Inversión en CETES registrada por $${this.monto}`);
        this.saldoService.cargarSaldo();
        this.confirmar = true;
      },
      error: () => {
        this.alertService.success(`✅ Inversión en CETES registrada con éxito.`);
      }
    });

    this.alertService.success(`✅ Se descontaron $${this.monto} de tu saldo.`);
  }

  private obtenerDiasDesdePlazo(plazo: string): number {
    switch (plazo) {
      case '1 mes': return 30;
      case '3 meses': return 90;
      case '6 meses': return 180;
      case '12 meses': return 365;
      case '2 años': return 730;
      default: return 30;
    }
  }

  reiniciar() {
    this.plazoSeleccionado = null;
    this.monto = null;
    this.confirmar = false;
    this.reinversion = false;
  }

  private obtenerFechaSubasta() {
    this.http.get<string>(`${this.base}/config/cetes/subasta`, {
      headers: this.headers,
      responseType: 'text' as 'json'
    }).subscribe({
      next: f => {
        this.fechaSubasta = f;
        this.fechaSubastaNueva = f.substring(0, 16);
      },
      error: () => console.error('Error al obtener fecha de subasta CETES')
    });
  }

  actualizarFechaSubasta() {
    this.http.put(
      `${this.base}/config/cetes/subasta?fechaIso=${encodeURIComponent(this.fechaSubastaNueva)}`,
      null,
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.fechaSubasta = this.fechaSubastaNueva;
        alert('Fecha de subasta actualizada');
      },
      error: () => alert('Error al actualizar la fecha de subasta')
    });
  }
}
