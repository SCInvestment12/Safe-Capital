import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { CetesCompraComponent } from './cetes-compra.component';
import { EtfsCompraComponent } from './etfs-compra.component';
import { AccionesCompraComponent } from './acciones-compra.component';
import { CriptoCompraComponent } from './cripto-compra.component';
import { ForexCompraComponent } from './forex-compra/forex-compra.component';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FormsModule,
    ChartWrapperComponent,
    CetesCompraComponent,
    EtfsCompraComponent,
    AccionesCompraComponent,
    CriptoCompraComponent,
    ForexCompraComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  tipo = 'acciones';
  tiposActivos = ['acciones', 'cetes', 'etfs', 'cripto', 'forex'];
  tipoActivoSeleccionado = 'acciones';

  instrumentoSeleccionado: any = null;
  userRole = '';
  saldo = 0;
  mostrarModal = false;

  constructor(private alertService: AlertService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userRole = payload.rol || '';
      } catch (error) {
        console.error('Error decodificando token:', error);
      }
    }

    this.obtenerSaldo();
  }

  obtenerSaldo() {
    this.authService.getSaldo().subscribe({
      next: (realSaldo) => {
        this.saldo = realSaldo;
        localStorage.setItem('saldo', this.saldo.toString());
      },
      error: (err) => console.error('Error al obtener saldo:', err)
    });
  }

  cambiarTab(tipo: string) {
    this.tipoActivoSeleccionado = tipo;
  }

  cambiarInstrumento(inst: any) {
    this.instrumentoSeleccionado = inst;
    this.tipo = inst.tipo;
  }

  abrirDeposito() {
    this.mostrarModal = true;
  }

  cerrarDeposito() {
    this.mostrarModal = false;
  }
}
