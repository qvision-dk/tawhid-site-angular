import { Component, signal, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface LoginFormValue {
  email: string;
  password: string;
}

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLoginComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly authService = inject(AuthService);

  readonly errorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  // Typed control getters
  get emailControl() {
    return this.loginForm.controls.email;
  }

  get passwordControl() {
    return this.loginForm.controls.password;
  }

  // Template-friendly error state getters
  get showEmailError(): boolean {
    return this.emailControl.invalid && this.emailControl.touched;
  }

  get showPasswordError(): boolean {
    return this.passwordControl.invalid && this.passwordControl.touched;
  }

  get isSubmitDisabled(): boolean {
    return this.loginForm.invalid || this.authService.loading();
  }

  get isLoading(): boolean {
    return this.authService.loading();
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }

    this.errorMessage.set(null);
    const { email, password }: LoginFormValue = this.loginForm.getRawValue();

    const { error } = await this.authService.signIn(email, password);

    if (error) {
      this.errorMessage.set(error.message || 'Login fejlede. Tjek email og password.');
      this.cdr.markForCheck();
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.errorMessage.set('Login fejlede. Tjek email og password.');
      this.cdr.markForCheck();
      return;
    }

    if (!this.authService.isAdmin()) {
      this.errorMessage.set('Du har ikke adgang til admin panel.');
      await this.authService.signOut();
      this.cdr.markForCheck();
      return;
    }

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
    this.router.navigateByUrl(returnUrl);
  }
}
