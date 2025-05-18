import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeradorDashboardComponent } from './moderador-dashboard.component';

describe('ModeradorDashboardComponent', () => {
  let component: ModeradorDashboardComponent;
  let fixture: ComponentFixture<ModeradorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeradorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeradorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
