import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface Project {
  id: string;
  name: string;
  description: string;
  clientName?: string;
  contractReference?: string;
  projectContext?: string;
  projectCharacter?: string;
  projectType?: string;
  developmentMode?: string;
  historical?: string;
  perimeter?: string;
  projectOwner?: string;
  projectLead?: string;
  projectTeam?: string;
  estimatedChargeHm?: number;
  estimatedBudgetMd?: number;
  estimatedDelayMonths?: number;
  budgetChargeCp?: number;
  budgetChargeId?: number;
  budgetChargeTotal?: number;
  budgetMdCp?: number;
  budgetMdId?: number;
  budgetMdTotal?: number;
  potentialRisks?: string;
  prerequisites?: string;
  status: 'planification' | 'en-cours' | 'termine' | 'suspendu';
  dueDate: string;
  createdAt: string;
  chefId: string;
}

export interface ProjectPayload {
  name: string;
  description: string;
  clientName: string;
  contractReference?: string;
  projectContext: string;
  projectCharacter: string;
  projectType: string;
  developmentMode: string;
  historical?: string;
  perimeter: string;
  projectOwner: string;
  projectLead: string;
  projectTeam: string;
  estimatedChargeHm: number;
  estimatedBudgetMd: number;
  estimatedDelayMonths: number;
  budgetChargeCp?: number;
  budgetChargeId?: number;
  budgetChargeTotal?: number;
  budgetMdCp?: number;
  budgetMdId?: number;
  budgetMdTotal?: number;
  potentialRisks: string;
  prerequisites: string;
  status: 'planification' | 'en-cours' | 'termine' | 'suspendu';
  dueDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/projects';
  private projects = signal<Project[]>([]);
  private currentProject = signal<Project | null>(null);

  constructor() {
    this.refreshProjects();
  }

  refreshProjects(): void {
    this.http.get<Project[]>(this.API_URL).subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Erreur lors du chargement des projets', err),
    });
  }

  getProjectById(id: string): Project | undefined {
    return this.projects().find((p) => p.id === id);
  }

  getProjectByIdFromApi(id: string): Observable<Project> {
    return this.http.get<Project>(`${this.API_URL}/${id}`);
  }

  createProject(project: ProjectPayload): Observable<Project> {
    return this.http.post<Project>(this.API_URL, project).pipe(
      tap(() => this.refreshProjects())
    );
  }

  updateProject(id: string, updates: Partial<ProjectPayload>): Observable<Project> {
    return this.http.put<Project>(`${this.API_URL}/${id}`, updates).pipe(
      tap(() => this.refreshProjects())
    );
  }

  deleteProject(id: string): void {
    this.http.delete<void>(`${this.API_URL}/${id}`).subscribe({
      next: () => this.refreshProjects(),
    });
  }

  getProjects() {
    return this.projects();
  }

  getCurrentProject() {
    return this.currentProject();
  }

  getProjectsStats() {
    const projects = this.projects();
    return {
      total: projects.length,
      enCours: projects.filter((p) => p.status === 'en-cours').length,
      termines: projects.filter((p) => p.status === 'termine').length,
      planification: projects.filter((p) => p.status === 'planification').length,
    };
  }
}
