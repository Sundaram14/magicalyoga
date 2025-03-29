import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerCampHeaderComponent } from './summer-camp-header.component';

describe('SummerCampHeaderComponent', () => {
  let component: SummerCampHeaderComponent;
  let fixture: ComponentFixture<SummerCampHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummerCampHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummerCampHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
