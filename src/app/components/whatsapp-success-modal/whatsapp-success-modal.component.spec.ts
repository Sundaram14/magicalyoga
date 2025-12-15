import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappSuccessModalComponent } from './whatsapp-success-modal.component';

describe('WhatsappSuccessModalComponent', () => {
  let component: WhatsappSuccessModalComponent;
  let fixture: ComponentFixture<WhatsappSuccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappSuccessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsappSuccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
