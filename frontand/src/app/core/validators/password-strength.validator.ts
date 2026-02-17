import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export interface PasswordRequirements {
  minLength: boolean;      // 8-12 caractères
  hasUppercase: boolean;   // Au moins une majuscule
  hasLowercase: boolean;   // Au moins une minuscule
  hasNumber: boolean;       // Au moins un chiffre
  hasSpecial: boolean;      // Au moins un caractère spécial
  noRepetition: boolean;    // Pas de répétition simple
}

/**
 * Validateur de force de mot de passe
 * Vérifie tous les critères de sécurité
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    const requirements = checkPasswordRequirements(value);

    // Le mot de passe est valide si tous les critères sont respectés
    const isValid = Object.values(requirements).every(req => req === true);

    if (isValid) {
      return null;
    }

    return { passwordStrength: { requirements } };
  };
}

/**
 * Vérifier tous les critères de sécurité du mot de passe
 */
export function checkPasswordRequirements(password: string): PasswordRequirements {
  return {
    minLength: password.length >= 8 && password.length <= 128,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noRepetition: !hasSimpleRepetition(password)
  };
}

/**
 * Vérifier s'il y a des répétitions simples (ex: aaa, 111)
 */
function hasSimpleRepetition(password: string): boolean {
  // Chercher 3 caractères identiques consécutifs
  return /(.)\1{2,}/.test(password);
}

/**
 * Calculer la force du mot de passe (0-5)
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  const requirements = checkPasswordRequirements(password);
  const metRequirements = Object.values(requirements).filter(req => req === true).length;

  // Convertir 0-6 en 0-5 (force scale)
  return Math.min(5, Math.floor((metRequirements / 6) * 5));
}

/**
 * Obtenir le label de force du mot de passe
 */
export function getPasswordStrengthLabel(strength: number): string {
  const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon', 'Excellent'];
  return labels[strength] || 'Très faible';
}

/**
 * Obtenir la couleur de la barre de force
 */
export function getPasswordStrengthColor(strength: number): string {
  const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#2ecc71', '#27ae60'];
  return colors[strength] || '#e74c3c';
}
