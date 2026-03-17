import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminService, AdminUser, UpdateAdminUserRequest, UserRole } from '../../../../services/admin';

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-user-edit.html',
  styleUrl: './admin-user-edit.css'
})
export class AdminUserEdit implements OnInit {
  private adminService = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly roles: UserRole[] = ['chef', 'pilote', 'admin'];

  userId = '';
  loading = false;
  saving = false;
  error = '';
  message = '';

  editModel: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
  } = {
    name: '',
    email: '',
    password: '',
    role: 'chef'
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Identifiant utilisateur invalide.';
      return;
    }

    this.userId = id;
    this.loadUser();
  }

  loadUser(): void {
    this.loading = true;
    this.error = '';

    this.adminService.listUsers().subscribe({
      next: (users) => {
        const user = users.find((item) => item.id === this.userId);
        if (!user) {
          this.loading = false;
          this.error = 'Utilisateur introuvable.';
          return;
        }

        this.applyUserModel(user);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err, 'Impossible de charger les informations utilisateur.');
      }
    });
  }

  saveEdit(): void {
    this.error = '';
    this.message = '';

    const name = this.editModel.name.trim();
    const email = this.editModel.email.trim().toLowerCase();

    if (name.length < 3) {
      this.error = 'Le nom doit contenir au moins 3 caracteres.';
      return;
    }

    if (email.length === 0) {
      this.error = 'L email est obligatoire.';
      return;
    }

    if (this.editModel.password.trim().length > 0 && this.editModel.password.length < 8) {
      this.error = 'Le nouveau mot de passe doit contenir au moins 8 caracteres.';
      return;
    }

    this.saving = true;

    const payload: UpdateAdminUserRequest = {
      name,
      email,
      role: this.editModel.role
    };

    if (this.editModel.password.trim().length > 0) {
      payload.password = this.editModel.password;
    }

    this.adminService.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Utilisateur modifie avec succes.';
        this.router.navigate(['/admin/users']);
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.error = this.extractErrorMessage(err, 'Modification utilisateur impossible.');
      }
    });
  }

  private applyUserModel(user: AdminUser): void {
    this.editModel = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    };
  }

  private extractErrorMessage(err: HttpErrorResponse, fallback: string): string {
    const errorBody = err.error as { message?: string } | null;
    const backendMessage = errorBody?.message?.trim();
    return backendMessage && backendMessage.length > 0 ? backendMessage : fallback;
  }
}
