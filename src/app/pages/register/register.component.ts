import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PaymentSessionService, SecurePaymentSession } from '../../../services/payment-session.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private paymentSessionService = inject(PaymentSessionService); // Add this

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  private sessionId: string = '';
  private shouldRedirectToPayment: boolean = false;

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      whatsAppNumber: ['', [Validators.required, Validators.pattern(/^\+[1-9]\d{1,14}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session'] || '';
      this.shouldRedirectToPayment = !!params['redirect'];
      
      console.log('Registration session ID:', this.sessionId);
      
      // Validate session exists
      if (this.sessionId && !this.paymentSessionService.validateSession(this.sessionId)) {
        console.warn('Invalid or expired payment session');
        this.sessionId = '';
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

   onSubmit(): void {
    if (this.registerForm.valid) {
        this.isLoading = true;
        this.errorMessage = '';

        const registerRequest = {
          whatsAppNumber: this.registerForm.value.whatsAppNumber,
          email: this.registerForm.value.email,
          firstName: this.registerForm.value.firstName,
          lastName: this.registerForm.value.lastName,
          password: this.registerForm.value.password
        };

        console.log('Sending registration request:', registerRequest);

        this.authService.register(registerRequest).subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Registration response:', response);
            
            if (response.success) {
              if (this.shouldRedirectToPayment && this.sessionId) {
                console.log('Redirecting to payment page with secure session');
                
                this.router.navigate(['/payment'], {
                  queryParams: { session: this.sessionId }
                });
              } else {
                this.router.navigate(['/dashboard']);
              }
            }
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Registration error details:', error); 
            
            const serverMessage = error?.error?.message || error?.message || 'Registration failed';
            this.errorMessage = serverMessage;

          }
      });
    }
  } 
}