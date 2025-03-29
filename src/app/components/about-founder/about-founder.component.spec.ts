import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutFounderComponent } from './about-founder.component';

describe('AboutFounderComponent', () => {
  let component: AboutFounderComponent;
  let fixture: ComponentFixture<AboutFounderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutFounderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutFounderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
