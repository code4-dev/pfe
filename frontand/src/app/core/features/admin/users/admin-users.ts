import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminService, AdminUser, CreateAdminUserRequest, UserRole } from '../../../services/admin';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);
  private auth = inject(Auth);

  readonly roles: UserRole[] = ['chef', 'pilote', 'admin'];

  users: AdminUser[] = [];
  loading = false;
  saving = false;
  processingUserId: string | null = null;
  message = '';
  error = '';

  roleDrafts: Record<string, UserRole> = {};

  createModel: CreateAdminUserRequest = {
    name: '',
    email: '',
    password: '',
    role: 'chef'
  };

  editUserId: string | null = null;
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
    this.loadUsers();
  }

  get currentUserId(): string {
    return this.auth.getCurrentUser()?.id ?? '';
  }

  isCurrentUser(userId: string): boolean {
    return this.currentUserId === userId;
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';
    this.adminService.listUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.roleDrafts = users.reduce<Record<string, UserRole>>((acc, user) => {
          acc[user.id] = user.role;
          return acc;
        }, {});
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = this.extractErrorMessage(err, 'Impossible de charger les utilisateurs.');
      }
    });
  }

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
    if (this.createModel.password.length < 8) {
      this.error = 'Le mot de passe doit contenir au moins 8 caracteres.';
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
        this.createModel = { name: '', email: '', password: '', role: 'chef' };
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.error = this.extractErrorMessage(err, 'Creation utilisateur impossible.');
      }
    });
  }

  startEdit(user: AdminUser): void {
    this.editUserId = user.id;
    this.editModel = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    };
    this.message = '';
    this.error = '';
  }

  cancelEdit(): void {
    this.editUserId = null;
  }

  saveEdit(): void {
    if (!this.editUserId) {
      return;
    }

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
    const payload: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    } = {
      name,
      email,
      role: this.editModel.role
    };
    if (this.editModel.password.trim().length > 0) {
      payload.password = this.editModel.password;
    }

    this.adminService.updateUser(this.editUserId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.message = 'Utilisateur modifie avec succes.';
        this.editUserId = null;
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.saving = false;
        this.error = this.extractErrorMessage(err, 'Modification utilisateur impossible.');
      }
    });
  }

  canApplyRole(user: AdminUser): boolean {
    const draft = this.roleDrafts[user.id];
    if (!draft || draft === user.role) {
      return false;
    }
    if (this.isCurrentUser(user.id) && draft !== 'admin') {
      return false;
    }
    return this.processingUserId !== user.id;
  }

  applyRole(user: AdminUser): void {
    const role = this.roleDrafts[user.id];
    if (!role || role === user.role) {
      return;
    }
    if (this.isCurrentUser(user.id) && role !== 'admin') {
      this.error = 'Vous ne pouvez pas retirer votre propre role admin.';
      return;
    }

    this.error = '';
    this.message = '';
    this.processingUserId = user.id;
    this.adminService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.processingUserId = null;
        this.message = 'Role mis a jour.';
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.processingUserId = null;
        this.error = this.extractErrorMessage(err, 'Attribution du role impossible.');
      }
    });
  }

  deleteUser(user: AdminUser): void {
    const confirmed = confirm(`Supprimer le compte de ${user.name} ?`);
    if (!confirmed) {
      return;
    }

    this.error = '';
    this.message = '';
    this.processingUserId = user.id;
    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.processingUserId = null;
        this.message = 'Utilisateur supprime.';
        this.loadUsers();
      },
      error: (err: HttpErrorResponse) => {
        this.processingUserId = null;
        this.error = this.extractErrorMessage(err, 'Suppression utilisateur impossible.');
      }
    });
  }

  trackByUserId(_: number, user: AdminUser): string {
    return user.id;
  }

  private extractErrorMessage(err: HttpErrorResponse, fallback: string): string {
    const errorBody = err.error as { message?: string } | null;
    const backendMessage = errorBody?.message?.trim();
    return backendMessage && backendMessage.length > 0 ? backendMessage : fallback;
  }
}
