import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  standalone: true
})
export class Register implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  showPassword = false;
  showConfirmPassword = false;

  passwordStrength = 0;
  passwordStrengthLabel = '';
  passwordStrengthColor = 'red';

  passwordRequirements = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
    noRepetition: false
  };

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.auth.getHomeRoute()]);
      return;
    }

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      numero: ['', [Validators.required, Validators.pattern(/^[\+]?[0-9\s\-\(\)]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.registerForm.get('password')?.valueChanges.subscribe(value => {
      this.evaluatePassword(value || '');
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getErrorMessage(field: string): string {
    const control = this.f[field];
    if (!control) return '';

    if (field === 'fullName') {
      if (control.errors?.['required']) return 'Le nom complet est obligatoire';
      if (control.errors?.['minlength']) return 'Le nom doit contenir au moins 3 caracteres';
    }

    if (field === 'numero') {
      if (control.errors?.['required']) return 'Le numero est obligatoire';
      if (control.errors?.['pattern']) return 'Format numero invalide';
    }

    if (field === 'email') {
      if (control.errors?.['required']) return 'L email est obligatoire';
      if (control.errors?.['email']) return 'Email invalide';
    }

    if (field === 'password') {
      if (control.errors?.['required']) return 'Le mot de passe est obligatoire';
      if (control.errors?.['minlength']) return 'Minimum 8 caracteres';
    }

    if (field === 'confirmPassword') {
      if (control.errors?.['required']) return 'La confirmation est obligatoire';
      if (this.registerForm.errors?.['mismatch']) return 'Les mots de passe ne correspondent pas';
    }

    return '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  evaluatePassword(password: string) {
    this.passwordRequirements.minLength = password.length >= 8;
    this.passwordRequirements.hasUppercase = /[A-Z]/.test(password);
    this.passwordRequirements.hasLowercase = /[a-z]/.test(password);
    this.passwordRequirements.hasNumber = /[0-9]/.test(password);
    this.passwordRequirements.hasSpecial = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);

    let strength = 0;
    Object.values(this.passwordRequirements).forEach(v => {
      if (v) strength++;
    });
    this.passwordStrength = strength;

    if (strength <= 2) {
      this.passwordStrengthLabel = 'Faible';
      this.passwordStrengthColor = '#dc3545';
    } else if (strength <= 4) {
      this.passwordStrengthLabel = 'Moyen';
      this.passwordStrengthColor = '#ffc107';
    } else {
      this.passwordStrengthLabel = 'Fort';
      this.passwordStrengthColor = '#28a745';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (!this.registerForm.valid) {
      return;
    }

    this.loading = true;
    const payload = {
      fullName: this.registerForm.value.fullName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate([this.auth.getHomeRoute()]);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 0) {
          this.error = 'Backend inaccessible (verifiez que le serveur tourne sur http://localhost:8080)';
        } else if (err.status === 403) {
          this.error = 'Acces refuse (403). Redemarrez le backend pour appliquer la configuration de securite.';
        } else if (err.status === 409) {
          this.error = 'Cet email est deja utilise';
        } else if (err.status === 400) {
          this.error = this.extractBackendMessage(err) ?? 'Donnees invalides';
        } else if (err.status >= 500) {
          this.error = this.extractBackendMessage(err) ?? 'Erreur serveur backend pendant la creation du compte';
        } else {
          this.error = this.extractBackendMessage(err) ?? 'Echec de creation du compte';
        }
      }
    });
  }

  private extractBackendMessage(err: HttpErrorResponse): string | null {
    const payload = err.error as { message?: string } | string | null;
    if (typeof payload === 'string') {
      const cleaned = payload.trim();
      return cleaned.length > 0 ? cleaned : null;
    }
    const message = payload?.message?.trim();
    return message && message.length > 0 ? message : null;
  }
}
