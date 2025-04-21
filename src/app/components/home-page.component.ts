import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouterLink } from '@angular/router'; // ← IMPORTANTE

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  futuros = [
    {
      img: 'assets/img/slide1.png',
      titulo: 'Mini NASDAQ 100',
      descripcion: 'Conoce el E-mini NASDAQ 100 y aprovecha el mercado tecnológico.'
    },
    {
      img: 'assets/img/slide2.png',
      titulo: 'Mini S&P 500',
      descripcion: 'Opera los movimientos del mercado con uno de los futuros más líquidos.'
    },
    {
      img: 'assets/img/slide3.png',
      titulo: 'Mini Dow Jones',
      descripcion: 'Invierte en las principales empresas estadounidenses con este índice.'
    }
  
  
  ];

  testimonios = [
    { nombre: 'Karla G.', comentario: 'Safe Capital es lo mejor que me ha pasado en 3 meses.' },
    { nombre: 'Luis M.', comentario: 'Está claro. Recomendadísimo.' },
    { nombre: 'Marta P.', comentario: 'Puedo operar desde el celular. Rápido y seguro.' }
  ];
  public year = new Date().getFullYear();
}
