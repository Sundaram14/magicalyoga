import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reset42LandingComponent } from './reset42-landing.component';

describe('Reset42LandingComponent', () => {
  let component: Reset42LandingComponent;
  let fixture: ComponentFixture<Reset42LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reset42LandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reset42LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
