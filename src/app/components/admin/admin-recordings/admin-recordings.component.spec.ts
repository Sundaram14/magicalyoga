import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecordingsComponent } from './admin-recordings.component';

describe('AdminRecordingsComponent', () => {
  let component: AdminRecordingsComponent;
  let fixture: ComponentFixture<AdminRecordingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecordingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
