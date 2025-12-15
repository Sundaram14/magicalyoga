import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-success-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-success-modal.component.html',
  styleUrls: ['./whatsapp-success-modal.component.css']
})
export class WhatsappSuccessModalComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() membershipDetails: any = null;
  @Output() closed = new EventEmitter<void>();

  showConfetti: boolean = false;

  ngOnInit() {
    if (this.isVisible) {
      this.triggerConfetti();
    }
  }

  ngOnChanges() {
    if (this.isVisible) {
      this.triggerConfetti();
    }
  }

  triggerConfetti() {
    this.showConfetti = true;
    setTimeout(() => {
      this.showConfetti = false;
    }, 4000);
  }

  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }
}
