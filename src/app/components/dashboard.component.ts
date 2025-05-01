// dashboard.component.ts actualizado
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
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    CetesCompraComponent,
    EtfsCompraComponent,
    AccionesCompraComponent,
    CriptoCompraComponent
  ],
  

  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(ChartWrapperComponent) chartWrapper!: ChartWrapperComponent;

  tipo = 'acciones';
  tiposActivos = ['acciones','cetes', 'etfs', 'cripto', ];
  tipoActivoSeleccionado = 'acciones';

  instrumentoSeleccionado: any = null;
  userRole = '';
  saldo = 0;
  isCuentaDemo = true;
  mostrarModal = false;
  esRetiro = false;

  historial: any[] = [];
  transacciones: any[] = [];

  constructor(private alertService: AlertService, private authService: AuthService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const demo = localStorage.getItem('isCuentaDemo');
    const sl = localStorage.getItem('saldo');
    const hist = localStorage.getItem('historial');
    const tx = localStorage.getItem('transacciones');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userRole = payload.rol || '';
      } catch (error) {
        console.error('Error decodificando token:', error);
      }
    }

    if (hist) this.historial = JSON.parse(hist);
    if (tx) this.transacciones = JSON.parse(tx);
    if (sl) this.saldo = parseFloat(sl);
    if (demo) this.isCuentaDemo = demo === 'true';

    if (!this.isCuentaDemo) {
      this.authService.getSaldo().subscribe({
        next: (realSaldo) => {
          this.saldo = realSaldo;
          localStorage.setItem('saldo', this.saldo.toString());
        },
        error: (err) => console.error('Error al obtener saldo:', err)
      });
    }
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

  esAdmin() { return this.userRole === 'ROLE_ADMIN'; }
  esModerador() { return this.userRole === 'ROLE_MODERATOR'; }
  esSuperAdmin() { return this.userRole === 'ROLE_SUPER_ADMIN'; }

  persistir() {
    localStorage.setItem('historial', JSON.stringify(this.historial));
    localStorage.setItem('transacciones', JSON.stringify(this.transacciones));
    localStorage.setItem('saldo', this.saldo.toString());
    localStorage.setItem('isCuentaDemo', this.isCuentaDemo.toString());
  }
}
