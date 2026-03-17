import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService, CreateAdminUserRequest, UserRole } from '../../../../services/admin';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-user-create.html',
  styleUrl: './admin-user-create.css'
})
export class AdminUserCreate {
  private adminService = inject(AdminService);
  private router = inject(Router);

  readonly roles: UserRole[] = ['chef', 'pilote', 'admin'];
  readonly strongPasswordMessage = 'Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule, un chiffre et un symbole.';

  saving = false;
  error = '';
  message = '';
  showPassword = false;

  createModel: CreateAdminUserRequest = {
    name: '',
    email: '',
    password: '',
    role: 'chef'
  };

  createUser(): void {
    this.error = '';
    this.message = '';

    const name = this.createModel.name.trim();
    const email = this.createModel.email.trim().toLowerCase();

    if (name.length < 3) {
      this.error = 'Le nom doit contenir au moins 3 caracteres.';
      return;
    }

    if (email.length === 0) {
      this.error = 'L email est obligatoire.';
      return;
    }

    if (!this.isStrongPassword(this.createModel.password)) {
      this.error = this.strongPasswordMessage;
      return;
    }

    this.saving = true;

    const payload: CreateAdminUserRequest = {
      name,
      email,
      password: this.createModel.password,
      role: this.createModel.role
    };

    this.adminService.createUser(payload).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Utilisateur cree avec succes.';
        this.router.navigate(['/admin/users']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.error = this.extractErrorMessage(err, 'Creation utilisateur impossible.');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private extractErrorMessage(err: HttpErrorResponse, fallback: string): string {
    const errorBody = err.error as { message?: string } | null;
    const backendMessage = errorBody?.message?.trim();
    return backendMessage && backendMessage.length > 0 ? backendMessage : fallback;
  }

  private isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return strongPasswordRegex.test(password);
  }
}
