import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummerCampOverviewComponent } from './summer-camp-overview.component';

describe('SummerCampOverviewComponent', () => {
  let component: SummerCampOverviewComponent;
  let fixture: ComponentFixture<SummerCampOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummerCampOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummerCampOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
