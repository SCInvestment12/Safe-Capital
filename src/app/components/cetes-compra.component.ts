// src/app/components/cetes-compra.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface PlazoCetes {
  plazo: string;
  tasa: string; // porcentaje con “%”
}

@Component({
  selector: 'app-cetes-compra',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, FormsModule ],
  templateUrl: './cetes-compra.component.html',
  styleUrls: ['./cetes-compra.component.css']
})
export class CetesCompraComponent implements OnInit {
  // 1) Array estático de plazos. Tendrá la tasa sustituida dinámicamente.
  plazos: PlazoCetes[] = [
    { plazo: '1 mes',   tasa: '—%' },
    { plazo: '3 meses', tasa: '—%' },
    { plazo: '6 meses', tasa: '—%' },
    { plazo: '12 meses',tasa: '—%' },
    { plazo: '2 años',  tasa: '—%' }
  ];
  plazoSeleccionado: PlazoCetes | null = null;
  confirmar = false;

  fechaSubasta = '';
  fechaSubastaNueva = '';
  private headers: HttpHeaders;
  private base   = 'https://safe-capital-backend.onrender.com/api';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.cargarTasaCetes();        // carga y asigna tasa a todos los plazos
    this.obtenerFechaSubasta();     // lee la fecha de subasta
  }

  /** Lee la tasa única de CETES y la aplica a cada plazo */
  private cargarTasaCetes() {
    this.http.get<number>(
      `${this.base}/config/cetes/tasa`,
      { headers: this.headers }
    ).subscribe({
      next: tasa => {
        const pct = tasa.toFixed(2) + '%';
        this.plazos = this.plazos.map(p => ({ ...p, tasa: pct }));
      },
      error: () => {
        console.error('No se pudo cargar la tasa de CETES');
      }
    });
  }

  /** Selección, confirmación y reinicio (igual que antes) */
  seleccionar(p: PlazoCetes) {
    this.plazoSeleccionado = p;
    this.confirmar = false;
  }
  continuarCompra() { this.confirmar = true; }
  reiniciar() {
    this.plazoSeleccionado = null;
    this.confirmar = false;
  }

  /** Fecha de subasta (igual que antes) */
  private obtenerFechaSubasta() {
    this.http.get<string>(
      `${this.base}/config/cetes/subasta`,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: f => {
        this.fechaSubasta = f;
        this.fechaSubastaNueva = f.substring(0,16); // prepara datetime-local
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
