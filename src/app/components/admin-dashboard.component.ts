import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  comprobantes: any[] = [];
  loading = false;

  // CETES
  tasaCetes = 0;
  fechaSubasta = '';
  fechaSubastaNueva = '';

  // Configuración bancaria
  banco = '';
  bancoNueva = '';
  cuenta = '';
  cuentaNueva = '';
  clabe = '';
  clabeNueva = '';

  private headers: HttpHeaders;
  private base = 'https://safe-capital-backend.onrender.com/api';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.cargarComprobantes();
    this.obtenerTasaCetes();
    this.obtenerFechaSubasta();
    this.obtenerConfiguracionBancaria();
  }

  // --- Comprobantes ---
  cargarComprobantes() {
    this.loading = true;
    this.http.get<any[]>(`${this.base}/comprobantes/pending`, { headers: this.headers })
      .subscribe({
        next: data => { this.comprobantes = data; this.loading = false; },
        error: () => { alert('Error al cargar comprobantes'); this.loading = false; }
      });
  }

  acreditarSaldo(id: number, correo: string) {
    const montoStr = prompt('Ingresa el monto a acreditar:');
    const monto = montoStr ? parseFloat(montoStr) : NaN;
    if (isNaN(monto)) { alert('Monto inválido.'); return; }
    this.http.post(
      `${this.base}/usuarios/saldo/acreditar`,
      { correoElectronico: correo, monto },
      { headers: this.headers }
    ).subscribe({
      next: () => this.cargarComprobantes(),
      error: () => alert('Error al acreditar saldo')
    });
  }

  rechazar(id: number) {
    this.http.put(
      `${this.base}/comprobantes/${id}/estado?estado=RECHAZADO`,
      null,
      { headers: this.headers }
    ).subscribe({
      next: () => this.cargarComprobantes(),
      error: () => alert('Error al actualizar estado')
    });
  }

  // --- CETES ---
  obtenerTasaCetes() {
    this.http.get<number>(
      `${this.base}/config/cetes/tasa`,
      { headers: this.headers }
    ).subscribe(t => this.tasaCetes = t);
  }

  actualizarTasaCetes() {
    this.http.put(
      `${this.base}/config/cetes/tasa?tasa=${this.tasaCetes}`,
      null,
      { headers: this.headers }
    ).subscribe({
      next: () => alert('Tasa de CETES actualizada'),
      error: () => alert('Error al actualizar la tasa de CETES')
    });
  }

  obtenerFechaSubasta() {
    this.http.get<string>(
      `${this.base}/config/cetes/subasta`,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe(f => {
      this.fechaSubasta = f;
      this.fechaSubastaNueva = f;
    });
  }

  actualizarFechaSubasta() {
    this.http.put(
      `${this.base}/config/cetes/subasta?fechaIso=${encodeURIComponent(this.fechaSubastaNueva)}`,
      null,
      { headers: this.headers }
    ).subscribe({
      next: () => alert('Fecha de subasta actualizada'),
      error: () => alert('Error al actualizar la fecha de subasta')
    });
  }

  // --- Configuración bancaria ---
  obtenerConfiguracionBancaria() {
    // Banco
    this.http.get(`${this.base}/config/banco`, {
      headers: this.headers,
      responseType: 'text'
    }).subscribe(v => { this.banco = v; this.bancoNueva = v; });

    // Cuenta
    this.http.get(`${this.base}/config/cuenta`, {
      headers: this.headers,
      responseType: 'text'
    }).subscribe(v => { this.cuenta = v; this.cuentaNueva = v; });

    // CLABE
    this.http.get(`${this.base}/config/clabe`, {
      headers: this.headers,
      responseType: 'text'
    }).subscribe(v => { this.clabe = v; this.clabeNueva = v; });
  }

  actualizarBanco() {
    this.http.put(
      `${this.base}/config/banco`,
      this.bancoNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => { this.banco = this.bancoNueva; alert('Banco actualizado'); },
      error: () => alert('Error al actualizar el banco')
    });
  }

  actualizarCuenta() {
    this.http.put(
      `${this.base}/config/cuenta`,
      this.cuentaNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => { this.cuenta = this.cuentaNueva; alert('Cuenta actualizada'); },
      error: () => alert('Error al actualizar la cuenta')
    });
  }

  actualizarClabe() {
    this.http.put(
      `${this.base}/config/clabe`,
      this.clabeNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => { this.clabe = this.clabeNueva; alert('CLABE actualizada'); },
      error: () => alert('Error al actualizar la CLABE')
    });
  }
}
