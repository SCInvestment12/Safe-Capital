import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  comprobantes: any[] = [];
  usuarios: any[] = [];
  movimientos: any[] = [];
  paresForex: {
    parDivisas: string;
    precioCompra: number;
    precioVenta: number;
    nuevoCompra?: number;
    nuevoVenta?: number;
  }[] = [];
  loading = false;

  tasasCetes: { [key: string]: number } = { '30': 0, '90': 0, '180': 0, '365': 0, '730': 0 };
  fechaSubasta = '';
  fechaSubastaNueva = '';

  banco = '';
  bancoNueva = '';
  cuenta = '';
  cuentaNueva = '';
  clabe = '';
  clabeNueva = '';

  userEmailParaSaldo = '';
  montoParaSaldo: number | null = null;

  nuevoPar: string = '';
  nuevoCompra: number | null = null;
  nuevoVenta: number | null = null;

  private headers: HttpHeaders;
  private base = 'https://safe-capital-backend.onrender.com/api';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token') || '';
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  ngOnInit(): void {
    this.cargarComprobantes();
    this.obtenerTasasCetes();
    this.obtenerFechaSubasta();
    this.obtenerConfiguracionBancaria();
    this.cargarUsuarios();
    this.cargarParesForex();
    this.cargarMovimientos();
  }

  // ✅ NUEVO MÉTODO PARA EXPORTAR MOVIMIENTOS A EXCEL
  descargarMovimientosExcel() {
    if (!this.movimientos || this.movimientos.length === 0) {
      alert('No hay movimientos para exportar.');
      return;
    }

    const data = this.movimientos.map(m => ({
      ID: m.id,
      Tipo: m.tipo,
      Monto: `$${m.monto}`,
      Fecha: m.fecha,
      Descripción: m.descripcion,
      Usuario: m.correoUsuario || m.usuario?.correo || 'N/A'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'Movimientos': worksheet }, SheetNames: ['Movimientos'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    FileSaver.saveAs(blob, 'movimientos.xlsx');
  }
descargarUsuariosExcel() {
  if (!this.usuarios || this.usuarios.length === 0) {
    alert('No hay usuarios para exportar.');
    return;
  }
  const data = this.usuarios.map(u => ({
    ID: u.idUsuario,
    Nombre: u.nombre,
    Apellidos: u.apellidos,
    Correo: u.correoElectronico,
    Teléfono: u.telefono,
    Rol: u.rol,
    Estado: u.estado,
    Saldo: `$${u.saldo ?? 0}`
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { 'Usuarios': ws }, SheetNames: ['Usuarios'] };
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'usuarios.xlsx');
}

descargarComprobantesExcel() {
  if (!this.comprobantes || this.comprobantes.length === 0) {
    alert('No hay comprobantes para exportar.');
    return;
  }
  const data = this.comprobantes.map(c => ({
    ID: c.id,
    Monto: `$${c.monto}`,
    Usuario: c.usuario?.correo || 'N/A',
    NombreArchivo: c.nombreArchivo,
    Estado: c.estado,
    Fecha: c.fecha
  }));
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = { Sheets: { 'Comprobantes': ws }, SheetNames: ['Comprobantes'] };
  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  FileSaver.saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'comprobantes.xlsx');
}



  cargarUsuarios() {
    this.http.get<any[]>(`${this.base}/usuarios/usuarios`, { headers: this.headers })
      .subscribe({
        next: data => this.usuarios = data,
        error: () => alert('Error al cargar usuarios')
      });
  }

  cargarMovimientos() {
    this.http.get<any[]>(`${this.base}/movimientos`, { headers: this.headers })
      .subscribe({
        next: data => this.movimientos = data,
        error: () => alert('Error al cargar movimientos')
      });
  }

  cargarComprobantes() {
    this.loading = true;
    this.http.get<any[]>(`${this.base}/comprobantes/pendientes`, { headers: this.headers })
      .subscribe({
        next: data => { this.comprobantes = data; this.loading = false; },
        error: () => { alert('Error al cargar comprobantes'); this.loading = false; }
      });
  }

  verArchivo(idUsuario: number, nombreArchivo: string) {
    const token = localStorage.getItem('token') || '';
    const nombreCodificado = encodeURIComponent(nombreArchivo);
    const url = `${this.base}/comprobantes/archivo/${idUsuario}/${nombreCodificado}`;
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado');
        return res.blob();
      })
      .then(blob => {
        const urlBlob = URL.createObjectURL(blob);
        window.open(urlBlob, '_blank');
      })
      .catch(() => alert('No se pudo abrir el archivo. Verifica permisos o token.'));
  }

  acreditarSaldo(id: number, correo: string) {
    const montoStr = prompt('Ingresa el monto a acreditar:');
    const monto = montoStr ? parseFloat(montoStr) : NaN;
    if (isNaN(monto)) {
      alert('Monto inválido.');
      return;
    }

    this.http.post(`${this.base}/usuarios/saldo/acreditar`,
      { correoElectronico: correo, monto },
      { headers: this.headers }
    ).subscribe({
      next: () => {
        this.cargarComprobantes();
        this.cargarMovimientos();
        alert(`✔ Se acreditó $${monto} a ${correo}`);
      },
      error: () => alert('Error al acreditar saldo')
    });
  }

  rechazar(id: number) {
    this.http.put(`${this.base}/comprobantes/${id}/estado?estado=RECHAZADO`,
      null, { headers: this.headers }
    ).subscribe({
      next: () => this.cargarComprobantes(),
      error: () => alert('Error al actualizar estado')
    });
  }

  obtenerTasasCetes() {
    this.http.get<{ [key: string]: number }>(`${this.base}/config/cetes/tasas`, { headers: this.headers })
      .subscribe(tasas => this.tasasCetes = tasas, () => alert('Error al obtener tasas CETES'));
  }

  actualizarTasasCetes() {
    this.http.put(`${this.base}/config/cetes/tasas`, this.tasasCetes, { headers: this.headers })
      .subscribe({
        next: () => alert('Tasas de CETES actualizadas'),
        error: () => alert('Error al actualizar las tasas de CETES')
      });
  }

  obtenerFechaSubasta() {
    this.http.get<string>(`${this.base}/config/cetes/subasta`,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe(f => {
      this.fechaSubasta = f;
      this.fechaSubastaNueva = f && f !== 'NO DEFINIDA' ? f.substring(0, 10) : '';
    }, () => alert('Error al obtener fecha de subasta'));
  }

  actualizarFechaSubasta() {
    this.http.put(`${this.base}/config/cetes/subasta?fechaIso=${encodeURIComponent(this.fechaSubastaNueva)}`,
      null, { headers: this.headers }
    ).subscribe({
      next: () => alert('Fecha de subasta actualizada'),
      error: () => alert('Error al actualizar la fecha de subasta')
    });
  }

  obtenerConfiguracionBancaria() {
    this.http.get(`${this.base}/config/banco`, {
      headers: this.headers, responseType: 'text'
    }).subscribe(v => { this.banco = v; this.bancoNueva = v; }, () => alert('Error al obtener banco'));

    this.http.get(`${this.base}/config/cuenta`, {
      headers: this.headers, responseType: 'text'
    }).subscribe(v => { this.cuenta = v; this.cuentaNueva = v; }, () => alert('Error al obtener cuenta'));

    this.http.get(`${this.base}/config/clabe`, {
      headers: this.headers, responseType: 'text'
    }).subscribe(v => { this.clabe = v; this.clabeNueva = v; }, () => alert('Error al obtener CLABE'));
  }

  actualizarBanco() {
    this.http.put(`${this.base}/config/banco`, this.bancoNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => { this.banco = this.bancoNueva; alert('Banco actualizado'); },
      error: () => alert('Error al actualizar el banco')
    });
  }

  actualizarCuenta() {
    this.http.put(`${this.base}/config/cuenta`, this.cuentaNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => { this.cuenta = this.cuentaNueva; alert('Cuenta actualizada'); },
      error: () => alert('Error al actualizar la cuenta')
    });
  }

  actualizarClabe() {
    this.http.put(`${this.base}/config/clabe`, this.clabeNueva,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => { this.clabe = this.clabeNueva; alert('CLABE actualizada'); },
      error: () => alert('Error al actualizar la CLABE')
    });
  }

  asignarSaldoManual() {
    if (!this.userEmailParaSaldo || !this.montoParaSaldo || this.montoParaSaldo <= 0) {
      alert('Por favor ingresa un correo válido y un monto mayor a cero.');
      return;
    }

    this.http.post(`${this.base}/usuarios/saldo/acreditar`,
      { correoElectronico: this.userEmailParaSaldo, monto: this.montoParaSaldo },
      { headers: this.headers }
    ).subscribe({
      next: () => {
        alert(`Se acreditó $${this.montoParaSaldo} a ${this.userEmailParaSaldo}`);
        this.userEmailParaSaldo = '';
        this.montoParaSaldo = null;
        this.cargarUsuarios();
        this.cargarMovimientos();
      },
      error: () => alert('Error al acreditar saldo manualmente')
    });
  }

  cargarParesForex() {
    this.http.get<any[]>(`${this.base}/admin/forex/pares`, { headers: this.headers })
      .subscribe({
        next: data => {
          this.paresForex = data.map(par => ({
            ...par,
            nuevoCompra: par.precioCompra,
            nuevoVenta: par.precioVenta
          }));
        },
        error: () => alert('Error al cargar pares Forex')
      });
  }

  actualizarPrecioPar(par: string, compra: number, venta: number) {
    if (!compra || !venta || compra <= 0 || venta <= 0) {
      alert('Ambos precios deben ser mayores a cero');
      return;
    }

    const c = Math.round(compra * 100000) / 100000;
    const v = Math.round(venta * 100000) / 100000;

    this.http.put(
      `${this.base}/admin/forex/precio?par=${encodeURIComponent(par)}&compra=${c}&venta=${v}`,
      null,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        alert(`✔ ${par}: compra ${c}, venta ${v}`);
        this.cargarParesForex();
      },
      error: () => alert('Error al actualizar precios del par')
    });
  }

  crearNuevoPar() {
    const par = this.nuevoPar?.trim().toUpperCase();
    const compra = this.nuevoCompra;
    const venta = this.nuevoVenta;

    if (!par || !/^[A-Z]{6,7}$/.test(par)) {
      alert('Par inválido. Usa formato como EURUSD, GBPJPY, etc.');
      return;
    }
    if (!compra || compra <= 0 || !venta || venta <= 0) {
      alert('Ambos precios son obligatorios y deben ser mayores a cero');
      return;
    }

    const c = Math.round(compra * 100000) / 100000;
    const v = Math.round(venta * 100000) / 100000;

    this.http.put(
      `${this.base}/admin/forex/precio?par=${encodeURIComponent(par)}&compra=${c}&venta=${v}`,
      null,
      { headers: this.headers, responseType: 'text' as 'json' }
    ).subscribe({
      next: () => {
        alert(`✅ ${par} agregado (compra ${c} / venta ${v})`);
        this.nuevoPar = '';
        this.nuevoCompra = null;
        this.nuevoVenta = null;
        this.cargarParesForex();
      },
      error: () => alert('Error al agregar el par')
    });
  }
}
