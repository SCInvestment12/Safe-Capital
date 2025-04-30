import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent {
  private secretKeyPressed = false; // Variable para controlar el atajo de teclado

  // Detectar la combinación secreta de teclas
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.shiftKey && event.key === 'G') {
      this.secretKeyPressed = true;  // Se activa el acceso al Super Admin
      alert('¡Acceso a Super Admin activado!');
    }
  }
}
