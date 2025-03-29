import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGalleryComponent } from './student-gallery.component';

describe('StudentGalleryComponent', () => {
  let component: StudentGalleryComponent;
  let fixture: ComponentFixture<StudentGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
