import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project.js';


@Component({
  selector: 'app-chef-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './chef-dashboard.html',
  styleUrl: './chef-dashboard.css',
})
export class ChefDashboard implements OnInit {
  private projectService = inject(ProjectService);
  
  stats: any = {
    total: 0,
    enCours: 0,
    termines: 0,
    planification: 0
  };

  recentProjects: any[] = [];

  ngOnInit(): void {
    this.stats = this.projectService.getProjectsStats();
    this.recentProjects = this.projectService.getProjects().slice(0, 5);
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'planification': 'Planification',
      'en-cours': 'En cours',
      'termine': 'Terminé',
      'suspendu': 'Suspendu'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
