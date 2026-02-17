import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project, ProjectService } from '../../../../services/project';
import { Followup, FollowupService } from '../../../../services/followup';

@Component({
  selector: 'app-followups',
  imports: [CommonModule, RouterLink],
  templateUrl: './followups.html',
  styleUrl: './followups.css',
})
export class Followups implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private followupService = inject(FollowupService);
  
  project: Project | null = null;
  followups: Followup[] = [];
  projectId: string | null = null;

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    if (this.projectId) {
      this.loadProject();
      this.loadFollowups();
    }
  }

  private loadProject(): void {
    if (this.projectId) {
      const project = this.projectService.getProjectById(this.projectId);
      this.project = project || null;
    }
  }

  private loadFollowups(): void {
    if (this.projectId) {
      this.followups = this.followupService.getFollowupsByProject(this.projectId);
    }
  }

  deleteFollowup(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce suivi ?')) {
      this.followupService.deleteFollowup(id);
      this.loadFollowups();
    }
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'progress-high';
    if (progress >= 50) return 'progress-medium';
    return 'progress-low';
  }
}
