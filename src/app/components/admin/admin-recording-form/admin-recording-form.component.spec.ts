import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecordingFormComponent } from './admin-recording-form.component';

describe('AdminRecordingFormComponent', () => {
  let component: AdminRecordingFormComponent;
  let fixture: ComponentFixture<AdminRecordingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecordingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRecordingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
