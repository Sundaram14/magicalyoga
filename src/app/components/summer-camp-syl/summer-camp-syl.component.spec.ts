import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerCampSylComponent } from './summer-camp-syl.component';

describe('SummerCampSylComponent', () => {
  let component: SummerCampSylComponent;
  let fixture: ComponentFixture<SummerCampSylComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummerCampSylComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummerCampSylComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
