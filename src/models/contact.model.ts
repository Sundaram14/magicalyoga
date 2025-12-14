export interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
}

export interface ContactResponse {
    success: boolean;
    message: string;
    timestamp: string;
}