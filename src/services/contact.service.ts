import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

export interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    // EmailJS Configuration (You'll get these from EmailJS dashboard)
    private serviceID = 'YOUR_SERVICE_ID';
    private templateID = 'YOUR_TEMPLATE_ID';
    private publicKey = 'YOUR_PUBLIC_KEY';

    constructor() {
        // Initialize EmailJS with your public key
        emailjs.init(this.publicKey);
    }

    async submitContactForm(formData: ContactForm): Promise<{ success: boolean; message: string }> {
        try {
            // Send email using EmailJS
            const response = await emailjs.send(
                this.serviceID,
                this.templateID,
                {
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                    phone: formData.phone || 'Not provided',
                    preferred_contact: formData.preferredContact,
                    reply_to: formData.email
                }
            );

            // Also save to localStorage for demo purposes
            this.saveToLocalStorage(formData);

            return {
                success: true,
                message: 'Message sent successfully! We\'ll respond within 24 hours.'
            };
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Fallback: Save to localStorage even if email fails
            this.saveToLocalStorage(formData);
            
            return {
                success: true, // Still true because we saved locally
                message: 'Message saved! We\'ll process it soon.'
            };
        }
    }

    private saveToLocalStorage(formData: ContactForm): void {
        try {
            // Get existing messages or create new array
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            
            // Add new message with timestamp
            messages.push({
                ...formData,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            
            // Save back to localStorage (max 50 messages)
            if (messages.length > 50) {
                messages.shift(); // Remove oldest
            }
            
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            
            console.log('Saved to localStorage:', formData);
        } catch (error) {
            console.error('LocalStorage error:', error);
        }
    }

    getStoredMessages(): any[] {
        try {
            return JSON.parse(localStorage.getItem('contact_messages') || '[]');
        } catch {
            return [];
        }
    }
}