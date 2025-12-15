import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferingsSectionComponent } from './offerings-section.component';

describe('OfferingsSectionComponent', () => {
  let component: OfferingsSectionComponent;
  let fixture: ComponentFixture<OfferingsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferingsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferingsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
