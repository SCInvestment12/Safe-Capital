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
      img: 'assets/img/slide10.jpg',
      titulo: 'CETES:',
      descripcion: 'Una opción confiable respaldada por el gobierno mexicano, que ofrece rendimientos atractivos con bajo riesgo y alta liquidez.'
    },
    {
      img: 'assets/img/slide11.jpg',
      titulo: 'ETFs:',
      descripcion: 'Que permiten diversificar tu portafolio de forma eficiente, accediendo a distintos mercados con bajo costo y menor riesgo.'
    },
    {
      img: 'assets/img/slide12.jpg',
      titulo: 'Acciones en bolsa:',
      descripcion: ' Aunque implican mayor volatilidad, tienen el potencial de generar ganancias superiores a largo plazo, ideales para inversionistas con un apetito de riesgo moderado a alto.'
    },
    {
      img: 'assets/img/slide13.jpg',
      titulo: 'Criptomonedas:',
      descripcion: 'Aunque son más volátiles, representan una alternativa innovadora y con gran proyección a futuro, ideal para perfiles que buscan diversificación y están dispuestos a asumir mayores riesgos.'
    },
    {
      img: 'assets/img/slide20.png',
      titulo: 'Forex:',
      descripcion: ' El mercado financiero en el que se intercambian monedas de diferentes países, como dólares, euros o pesos. Las variaciones en su valor permiten a los inversionistas buscar rendimientos. Es una alternativa dinámica y global para hacer crecer tu dinero. '
    }
  
  
  ];


  guia = [
  {
    img: 'assets/img/slide14.jpg',
    titulo: 'Comisión Nacional Bancaria y de Valores',
    
  },
  {
    img: 'assets/img/slide15.jpg',
    titulo: 'Secretaria De Hacienda',
    
  },
  {
    img: 'assets/img/slide16.jpg', 
    titulo: 'Banco de México',  
  },
  {
    img: 'assets/img/metodos.jpg',
    titulo: 'Metodos De Pago',
    
  },
  
];


  testimonios = [
    { nombre: 'Jesus Reyes Garcia.', comentario: 'Al inicio desconfié, pero conforme me asesoraron y entendí mejor como invertir he generado ganancias considerables, estoy muy contento con su servicio. ', correo: 'jesusreyesgarcia890@gmail.com ' },
    { nombre: 'Nora Pacheco S.', comentario: 'Excelente atención, totalmente recomendable', correo: 'pachecosolisnora@gmail.com ' },
    { nombre: 'Alejandra Márquez R .', comentario: 'Super recomendados busque opciones donde poder invertir mi dinero de manera segura y la atención que me brindaron es excelente, no he tenido ningún problema para realizar mis depósitos y retiros.', correo: 'alemar9990@gmail.com  ' },
    { nombre: 'Mario Bermudez Hernandez .', comentario: 'Comencé con poco para ver qué tan confiable es, tengo 3 meses en operaciones y todo perfecto, la recomiendo totalmente', correo: 'MarbrosBhernadez89@outlook.es' },
    { nombre: 'Miguel Ortiz Hernández .', comentario: 'Es una plataforma muy fácil de utilizar con el asesoramiento que me brindaron logre poder manejarla de manera correcta, en otros lugares hay tanta información que termine confundido, gracias bendiciones.', correo: 'Miguesharkbon@gmail.com' },
  ];
  public year = new Date().getFullYear();
}
