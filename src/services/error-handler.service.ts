import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

export interface ErrorMessage {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private router = inject(Router);

  handleHttpError(error: any): ErrorMessage {
    console.error('HTTP Error:', error);

    if (error.status === 0) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        type: 'error'
      };
    }

    if (error.status === 401) {
      this.router.navigate(['/login']);
      return {
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.',
        type: 'warning'
      };
    }

    if (error.status === 403) {
      return {
        title: 'Access Denied',
        message: 'You do not have permission to access this resource.',
        type: 'error'
      };
    }

    if (error.status === 404) {
      return {
        title: 'Not Found',
        message: 'The requested resource was not found.',
        type: 'error'
      };
    }

    if (error.status >= 500) {
      return {
        title: 'Server Error',
        message: 'Something went wrong on our end. Please try again later.',
        type: 'error'
      };
    }

    // Default error message
    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred.',
      type: 'error'
    };
  }

  handleNetworkError(): ErrorMessage {
    return {
      title: 'Network Error',
      message: 'Please check your internet connection and try again.',
      type: 'error'
    };
  }
}