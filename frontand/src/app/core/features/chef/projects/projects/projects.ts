import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project';
import { Auth } from '../../../../services/auth';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
  private projectService = inject(ProjectService);
  private auth = inject(Auth);

  readonly isPilote = computed(() => this.auth.hasRole('pilote'));

  filterStatus = signal<string>('all');
  searchText = signal<string>('');

  filteredProjects = computed(() => {
    const allProjects = this.projectService.getProjects();
    const status = this.filterStatus();
    const search = this.searchText().toLowerCase().trim();

    return allProjects.filter((p) => {
      const matchesStatus = status === 'all' || p.status.toLowerCase() === status.toLowerCase();
      const matchesSearch =
        !search || p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    this.projectService.refreshProjects();
  }

  onFilterChange(status: string): void {
    this.filterStatus.set(status);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  deleteProject(id: string): void {
    if (confirm('Etes-vous sur de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(id);
    }
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      planification: 'Planification',
      'en-cours': 'En cours',
      termine: 'Termine',
      suspendu: 'Suspendu',
    };
    return labels[status.toLowerCase()] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  }

  getPageTitle(): string {
    return 'Mes Projets';
  }

  canManageProjects(): boolean {
    return !this.isPilote();
  }
}
