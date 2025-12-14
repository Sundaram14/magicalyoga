import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalPagesComponent } from './legal-pages.component';

describe('LegalPagesComponent', () => {
  let component: LegalPagesComponent;
  let fixture: ComponentFixture<LegalPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
