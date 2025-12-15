import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactService, ContactForm } from '../../../services/contact.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, FooterComponent],
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent {
    contactForm: ContactForm = {
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        preferredContact: 'email'
    };

    isLoading = false;
    submitted = false;
    responseMessage = '';
    isError = false;

    // Contact information
    contactInfo = {
        phone: '+91 98845 24742',
        whatsapp: '+91 98845 24742',
        email: 'reach@magicalyoga.com',
        hours: 'Monday - Saturday: 6:00 AM - 9:00 PM<br>Sunday: 7:00 AM - 12:00 PM'
    };
    // Social links
    socialLinks = [
        { icon: 'fab fa-whatsapp', label: 'WhatsApp', link: 'https://wa.me/+919884524742', color: '#33abbd' },
        { icon: 'fab fa-instagram', label: 'Instagram', link: 'https://www.instagram.com/magical__yoga', color: '#33abbd' },
        { icon: 'fa-solid fa-envelope', label: 'Email', link: 'mailto:reach@magicalyoga.com', color: '#33abbd' },
        { icon: 'fab fa-youtube', label: 'YouTube', link: 'https://www.youtube.com/channel/UChLcOzqm3t492pWi5oOzhpA?sub_confirmation=1', color: '#33abbd' }
    ];

    constructor(private contactService: ContactService) {}

    async onSubmit(): Promise<void> {
        // Validation
        if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
            this.showMessage('Please fill in all required fields.', true);
            return;
        }

        if (!this.isValidEmail(this.contactForm.email)) {
            this.showMessage('Please enter a valid email address.', true);
            return;
        }

        this.isLoading = true;
        this.isError = false;

        try {
            const result = await this.contactService.submitContactForm(this.contactForm);
            
            this.submitted = true;
            this.showMessage(result.message, false);
            
            // Auto-reset form after 5 seconds
            setTimeout(() => {
                this.resetForm();
            }, 5000);
            
        } catch (error) {
            this.showMessage('Something went wrong. Please try again or contact us directly.', true);
        } finally {
            this.isLoading = false;
        }
    }

    private showMessage(message: string, isError: boolean): void {
        this.responseMessage = message;
        this.isError = isError;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            this.responseMessage = '';
        }, 5000);
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    resetForm(): void {
        this.contactForm = {
            name: '',
            email: '',
            subject: '',
            message: '',
            phone: '',
            preferredContact: 'email'
        };
        this.submitted = false;
        this.responseMessage = '';
    }

    copyToClipboard(text: string, type: string): void {
        navigator.clipboard.writeText(text).then(() => {
            // Show temporary notification
            const originalMessage = this.responseMessage;
            this.showMessage(`${type} copied to clipboard!`, false);
            
            setTimeout(() => {
                this.responseMessage = originalMessage;
            }, 2000);
        });
    }

    openWhatsApp(): void {
        const message = `Hello Magical Yoga, I have a question:`;
        const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    getDemoMessages(): number {
        const messages = this.contactService.getStoredMessages();
        return messages.length;
    }
}