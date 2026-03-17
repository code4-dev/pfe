import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordRequirements {
  minLength: boolean;      // 8-12 caractères
  hasUppercase: boolean;   // Au moins une majuscule
  hasLowercase: boolean;   // Au moins une minuscule
  hasNumber: boolean;       // Au moins un chiffre
  hasSpecial: boolean;      // Au moins un caractère spécial
 
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const requirements = checkPasswordRequirements(value);

    const isValid = Object.values(requirements).every(req => req === true);

    if (isValid) {
      return null;
    }

    return { passwordStrength: { requirements } };
  };
}

export function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8 && password.length <= 128,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
}

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  const requirements = checkPasswordRequirements(password);
  const metRequirements = Object.values(requirements).filter(req => req === true).length;

  return Math.min(5, Math.floor((metRequirements / 5) * 5));
}

export function getPasswordStrengthLabel(strength: number): string {
  const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon', 'Excellent'];
  return labels[strength] || 'Très faible';
}

export function getPasswordStrengthColor(strength: number): string {
  const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#2ecc71', '#27ae60'];
  return colors[strength] || '#e74c3c';
}
