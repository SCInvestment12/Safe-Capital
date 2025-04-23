import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule], // <- AÑADIDO AQUÍ
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  montoRetiro: number = 0;
  clabe: string = '';

  solicitarRetiro() {
    console.log('Solicitud enviada:', {
      monto: this.montoRetiro,
      clabe: this.clabe
    });
  }
}
