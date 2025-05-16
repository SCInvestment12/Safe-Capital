import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositoModalComponent } from './deposito-modal.component';

describe('DepositoModalComponent', () => {
  let component: DepositoModalComponent;
  let fixture: ComponentFixture<DepositoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
