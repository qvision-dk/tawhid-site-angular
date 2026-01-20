import { Component, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Admin Login Component
 * 
 * Handles authentication for admin users.
 * Responsibilities:
 * - Form setup and validation
 * - Submit handler
 * - Calls to AuthService
 * - Navigation after successful login
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  readonly errorMessage = signal<string | null>(null);
  readonly loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.errorMessage.set(null);
    const { email, password } = this.loginForm.value;

    const { error } = await this.authService.signIn(email, password);

    if (error) {
      this.errorMessage.set(error.message || 'Login fejlede. Tjek email og password.');
      this.cdr.markForCheck();
      return;
    }

    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.errorMessage.set('Login fejlede. Tjek email og password.');
      this.cdr.markForCheck();
      return;
    }

    // Check if user is admin
    if (!this.authService.isAdmin()) {
      this.errorMessage.set('Du har ikke adgang til admin panel.');
      await this.authService.signOut();
      this.cdr.markForCheck();
      return;
    }

    // Redirect to returnUrl or default to /admin
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    this.router.navigateByUrl(returnUrl);
  }
}
