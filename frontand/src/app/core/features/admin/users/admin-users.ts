import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AdminService, AdminUser, UserRole } from '../../../services/admin';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {
  private adminService = inject(AdminService);
  private auth = inject(Auth);
  private router = inject(Router);

  readonly roles: UserRole[] = ['chef', 'pilote', 'admin'];
  readonly defaultVisibleUsers = 5;

  users: AdminUser[] = [];
  loading = false;
  processingUserId: string | null = null;
  message = '';
  error = '';
  searchTerm = '';
  visibleUsers = this.defaultVisibleUsers;

  roleDrafts: Record<string, UserRole> = {};

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
        this.visibleUsers = this.defaultVisibleUsers;
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

  startEdit(user: AdminUser): void {
    this.router.navigate(['/admin/users/edit', user.id]);
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

  onSearchChange(): void {
    this.visibleUsers = this.defaultVisibleUsers;
  }

  showMore(): void {
    this.visibleUsers += this.defaultVisibleUsers;
  }

  showLess(): void {
    this.visibleUsers = this.defaultVisibleUsers;
  }

  get filteredUsers(): AdminUser[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) {
      return this.users;
    }
    return this.users.filter((user) => {
      const nameMatches = user.name.toLowerCase().includes(query);
      const emailMatches = user.email.toLowerCase().includes(query);
      const roleMatches = this.getRoleLabel(user.role).toLowerCase().includes(query);
      return nameMatches || emailMatches || roleMatches;
    });
  }

  get displayedUsers(): AdminUser[] {
    return this.filteredUsers.slice(0, this.visibleUsers);
  }

  get hasMoreUsers(): boolean {
    return this.displayedUsers.length < this.filteredUsers.length;
  }

  get canShowLess(): boolean {
    return !this.hasMoreUsers && this.filteredUsers.length > this.defaultVisibleUsers;
  }

  getRoleClass(role: UserRole): string {
    switch (role) {
      case 'admin':
        return 'admin';
      case 'chef':
        return 'chef';
      default:
        return 'pilote';
    }
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case 'admin':
        return 'ADMIN';
      case 'chef':
        return 'CHEF';
      default:
        return 'PILOTE';
    }
  }

  private extractErrorMessage(err: HttpErrorResponse, fallback: string): string {
    const errorBody = err.error as { message?: string } | null;
    const backendMessage = errorBody?.message?.trim();
    return backendMessage && backendMessage.length > 0 ? backendMessage : fallback;
  }
}
