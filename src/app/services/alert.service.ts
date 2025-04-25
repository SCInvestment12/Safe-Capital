// src/app/services/alert.service.ts
import Swal from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  success(mensaje: string) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      confirmButtonColor: '#00c897'
    });
  }

  error(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
      confirmButtonColor: '#dc3545'
    });
  }

  confirmacion(pregunta: string, confirmText: string = 'Sí, continuar'): Promise<boolean> {
    return Swal.fire({
      icon: 'question',
      title: '¿Estás seguro?',
      text: pregunta,
      showCancelButton: true,
      confirmButtonColor: '#00c897',
      cancelButtonColor: '#aaa',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancelar'
    }).then(result => result.isConfirmed);
  }

  mostrarGanar(monto: number) {
    Swal.fire({
      icon: 'success',
      title: '🎉 ¡Ganaste!',
      text: `Has ganado $${monto}. ¡Felicidades!`,
      confirmButtonColor: '#00c897'
    });
  }
  
  mostrarPerder() {
    Swal.fire({
      icon: 'error',
      title: '😢 Perdiste',
      text: 'Sigue intentando, la próxima puede ser la tuya.',
      confirmButtonColor: '#dc3545'
    });
  }
  
}
