import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project, ProjectService } from '../../../services/project';

@Component({
  selector: 'app-pilote-suivi-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pilote-suivi-projets.html',
  styleUrl: './pilote-suivi-projets.css'
})
export class PiloteSuiviProjets implements OnInit {
  private projectService = inject(ProjectService);
  readonly defaultVisibleProjects = 5;

  search = '';
  statusFilter: 'all' | Project['status'] = 'all';
  visibleProjects = this.defaultVisibleProjects;

  ngOnInit(): void {
    this.projectService.refreshProjects();
  }

  get projects(): Project[] {
    return this.projectService.getProjects();
  }

  get totalProjects(): number {
    return this.projects.length;
  }

  get activeProjects(): number {
    return this.projects.filter((project) => project.status === 'en-cours').length;
  }

  get completedProjects(): number {
    return this.projects.filter((project) => project.status === 'termine').length;
  }

  get overdueProjects(): number {
    return this.projects.filter((project) => this.isOverdue(project)).length;
  }

  get filteredProjects(): Project[] {
    return this.projects.filter((project) => {
      const matchesSearch = project.name.toLowerCase().includes(this.search.toLowerCase())
        || (project.clientName ?? '').toLowerCase().includes(this.search.toLowerCase());
      const matchesStatus = this.statusFilter === 'all' || project.status === this.statusFilter;
      return matchesSearch && matchesStatus;
    });
  }

  get displayedProjects(): Project[] {
    return this.filteredProjects.slice(0, this.visibleProjects);
  }

  get hasMoreProjects(): boolean {
    return this.displayedProjects.length < this.filteredProjects.length;
  }

  get canShowLess(): boolean {
    return !this.hasMoreProjects && this.filteredProjects.length > this.defaultVisibleProjects;
  }

  isOverdue(project: Project): boolean {
    if (project.status === 'termine') {
      return false;
    }
    const today = new Date();
    const dueDate = new Date(project.dueDate);
    return dueDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  statusLabel(status: Project['status']): string {
    if (status === 'planification') {
      return 'Planification';
    }
    if (status === 'en-cours') {
      return 'En cours';
    }
    if (status === 'termine') {
      return 'Termine';
    }
    return 'Suspendu';
  }

  statusBadgeClass(status: Project['status']): string {
    if (status === 'termine') {
      return 'badge bg-success-subtle text-success-emphasis border border-success-subtle';
    }
    if (status === 'en-cours') {
      return 'badge bg-primary-subtle text-primary-emphasis border border-primary-subtle';
    }
    if (status === 'planification') {
      return 'badge bg-warning-subtle text-warning-emphasis border border-warning-subtle';
    }
    return 'badge bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle';
  }

  trackByProjectId(_: number, project: Project): string {
    return project.id;
  }

  onFiltersChange(): void {
    this.visibleProjects = this.defaultVisibleProjects;
  }

  showMore(): void {
    this.visibleProjects += this.defaultVisibleProjects;
  }

  showLess(): void {
    this.visibleProjects = this.defaultVisibleProjects;
  }
}
