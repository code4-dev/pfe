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
    if (!this.projectId) {
      return;
    }
    this.loadProject();
    this.loadFollowups();
  }

  private loadProject(): void {
    if (!this.projectId) {
      return;
    }

    this.projectService.getProjectByIdFromApi(this.projectId).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (err) => {
        console.error('Erreur chargement projet', err);
      }
    });
  }

  private loadFollowups(): void {
    if (!this.projectId) {
      return;
    }

    this.followupService.listFollowups(this.projectId).subscribe({
      next: (items) => {
        this.followups = items;
      },
      error: (err) => {
        console.error('Erreur chargement suivis', err);
      }
    });
  }

  deleteFollowup(id: string): void {
    if (!this.projectId) {
      return;
    }
    if (!confirm('Etes-vous sur de vouloir supprimer ce suivi ?')) {
      return;
    }

    this.followupService.deleteFollowup(this.projectId, id).subscribe({
      next: () => {
        this.loadFollowups();
      },
      error: (err) => {
        console.error('Erreur suppression suivi', err);
      }
    });
  }

  getProgressColor(progress: number): string {
    if (progress >= 75) return 'progress-high';
    if (progress >= 50) return 'progress-medium';
    return 'progress-low';
  }
}
