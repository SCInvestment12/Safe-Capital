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
      titulo: 'Cetes',
      descripcion: 'Invierte de forma segura en Certificados de la Tesorería del gobierno mexicano.'
    },
    {
      img: 'assets/img/slide2.png',
      titulo: 'ETFs',
      descripcion: 'Descubre cómo diversificar tu portafolio invirtiendo en ETFs.'
    },
    {
      img: 'assets/img/slide3.png',
      titulo: 'Acciones',
      descripcion: 'Descubre qué son las acciones y cómo invertir en ellas de forma estratégica.'
    },
    {
      img: 'assets/img/slide7.png',
      titulo: 'Criptomonedas',
      descripcion: 'Invierte en criptomonedas y participa en el mercado financiero del futuro.'
    }
  
  
  ];


  guia = [
  {
    img: 'assets/img/slide4.png',
    titulo: 'Guía básica sobre el Trading',
    descripcion: 'Conoce los conceptos clave, plataformas, análisis técnico y tipos de órdenes para empezar a invertir como un profesional.'
  },
  {
    img: 'assets/img/slide5.png',
    titulo: 'Opciones Binarias',
    descripcion: 'Aprende cómo funcionan las opciones binarias, cuándo operar y cuáles son los riesgos y oportunidades que ofrecen.'
  },
  {
    img: 'assets/img/slide6.png',
    titulo: 'Mentalidad Ganadora',
    descripcion: 'Descubre los pilares del éxito financiero: disciplina, control emocional y toma de decisiones inteligente en cada inversión.'
  }
];


  testimonios = [
    { nombre: 'Karla G.', comentario: 'Safe Capital es lo mejor que me ha pasado en 3 meses.' },
    { nombre: 'Luis M.', comentario: 'Está claro. Recomendadísimo.' },
    { nombre: 'Marta P.', comentario: 'Puedo operar desde el celular. Rápido y seguro.' }
  ];
  public year = new Date().getFullYear();
}
