import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top5InstrumentosComponent } from './top5-instrumentos.component';

describe('Top5InstrumentosComponent', () => {
  let component: Top5InstrumentosComponent;
  let fixture: ComponentFixture<Top5InstrumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Top5InstrumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Top5InstrumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
