import { Injectable, signal } from '@angular/core';
import { checkPasswordRequirements } from '../validators/password-strength.validator';

export interface RegisterUser {
  id?: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: 'chef' | 'admin' | 'pilote';
}

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: 'chef' | 'admin' | 'pilote';
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private users = signal<User[]>([]);
  private registrationError = signal<string>('');

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    const stored = localStorage.getItem('users');
    if (stored) {
      this.users.set(JSON.parse(stored));
    } else {
      // Utilisateur de demo pré-chargé
      const demoUsers: User[] = [
        {
          id: '1',
          email: 'chef@example.com',
          password: 'password123',
          fullName: 'Chef de Projet',
          role: 'chef',
          createdAt: new Date().toISOString()
        }
      ];
      this.users.set(demoUsers);
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users()));
  }

  /**
   * Enregistrer un nouvel utilisateur
   */
  registerUser(data: RegisterUser): { success: boolean; message: string; user?: User } {
    // Réinitialiser les erreurs
    this.registrationError.set('');

    // Validation
    if (!data.email || !data.password || !data.fullName) {
      this.registrationError.set('Tous les champs sont obligatoires');
      return { success: false, message: 'Tous les champs sont obligatoires' };
    }

    if (data.email.length < 5) {
      this.registrationError.set('Email doit contenir au moins 5 caractères');
      return { success: false, message: 'Email doit contenir au moins 5 caractères' };
    }

    if (!data.email.includes('@')) {
      this.registrationError.set('Email invalide');
      return { success: false, message: 'Email invalide' };
    }

    if (data.password.length < 8 || data.password.length > 128) {
      this.registrationError.set('Le mot de passe doit contenir entre 8 et 128 caractères');
      return { success: false, message: 'Le mot de passe doit contenir entre 8 et 128 caractères' };
    }

    // Vérifier la force du mot de passe
    const passwordRequirements = checkPasswordRequirements(data.password);
    if (!Object.values(passwordRequirements).every(req => req === true)) {
      this.registrationError.set('Le mot de passe ne respecte pas les critères de sécurité');
      return { success: false, message: 'Le mot de passe ne respecte pas tous les critères de sécurité' };
    }

    if (data.password !== data.confirmPassword) {
      this.registrationError.set('Les mots de passe ne correspondent pas');
      return { success: false, message: 'Les mots de passe ne correspondent pas' };
    }

    if (data.fullName.length < 3) {
      this.registrationError.set('Le nom complet doit contenir au moins 3 caractères');
      return { success: false, message: 'Le nom complet doit contenir au moins 3 caractères' };
    }

    // Vérifier si l'email existe déjà
    if (this.emailExists(data.email)) {
      this.registrationError.set('Cet email est déjà utilisé');
      return { success: false, message: 'Cet email est déjà utilisé' };
    }

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      password: data.password, // En production, utiliser un hash !
      fullName: data.fullName,
      role: data.role || 'user',
      createdAt: new Date().toISOString()
    };

    // Ajouter à la liste
    this.users.set([...this.users(), newUser]);
    this.saveUsers();

    return {
      success: true,
      message: 'Compte créé avec succès!',
      user: newUser
    };
  }

  /**
   * Vérifier si un email existe déjà
   */
  emailExists(email: string): boolean {
    return this.users().some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Obtenir tous les utilisateurs (pour admin)
   */
  getAllUsers(): User[] {
    return this.users();
  }

  /**
   * Obtenir le nombre d'utilisateurs
   */
  getUserCount(): number {
    return this.users().length;
  }

  /**
   * Obtenir l'erreur d'enregistrement
   */
  getRegistrationError(): string {
    return this.registrationError();
  }

  /**
   * Réinitialiser l'erreur
   */
  clearError(): void {
    this.registrationError.set('');
  }
}
