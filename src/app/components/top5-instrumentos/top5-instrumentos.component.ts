import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingService } from '../../services/trading.service';

@Component({
  selector: 'app-top5-instrumentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top5-instrumentos.component.html',
  styleUrls: ['./top5-instrumentos.component.css']
})
export class Top5InstrumentosComponent implements OnInit {
  @Input() tipo: string = 'cetes';
  @Output() instrumentoSeleccionado = new EventEmitter<any>();

  top5: any[] = [];

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.obtenerTop5();
  }

  obtenerTop5(): void {
    this.tradingService.getTop5(this.tipo).subscribe({
      next: (data) => this.top5 = data,
      error: (err) => console.error('Error al obtener top 5:', err)
    });
  }

  verGrafico(item: any): void {
    this.instrumentoSeleccionado.emit(item);
  }
}
