import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private auth = inject(Auth);

  readonly currentUser = computed(() => this.auth.getCurrentUser());
  readonly currentRole = computed(() => this.currentUser()?.role ?? null);

  isAdmin(): boolean {
    return this.currentRole() === 'admin';
  }

  isChef(): boolean {
    return this.currentRole() === 'chef';
  }

  isPilote(): boolean {
    return this.currentRole() === 'pilote';
  }
}
