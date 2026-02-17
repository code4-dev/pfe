import { Injectable, signal } from '@angular/core';

export interface Followup {
  id: string;
  projectId: string;
  title: string;
  description: string;
  progress: number;
  issues: string;
  decisions: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FollowupService {
  private followups = signal<Followup[]>([]);

  constructor() {
    this.loadFollowups();
  }

  private loadFollowups(): void {
    const stored = localStorage.getItem('followups');
    if (stored) {
      const followups = JSON.parse(stored).map((f: any) => ({
        ...f,
        createdAt: new Date(f.createdAt),
        updatedAt: new Date(f.updatedAt)
      }));
      this.followups.set(followups);
    } else {
      // Données de test
      const mockFollowups: Followup[] = [
        {
          id: '1',
          projectId: '1',
          title: 'Mise en place de la base de données',
          description: 'Configuration initiale de la base de données MongoDB',
          progress: 80,
          issues: 'Quelques problèmes de performance identifiés',
          decisions: 'Utilisation d\'une stratégie d\'indexation optimisée',
          createdAt: new Date('2026-01-15'),
          updatedAt: new Date('2026-01-20')
        },
        {
          id: '2',
          projectId: '1',
          title: 'Développement du frontend',
          description: 'Création des interfaces utilisateur avec Angular',
          progress: 60,
          issues: 'Intégration avec les APIs externes en cours',
          decisions: 'Utilisation d\'Angular avec Material Design',
          createdAt: new Date('2026-01-20'),
          updatedAt: new Date('2026-02-01')
        }
      ];
      this.followups.set(mockFollowups);
      this.saveFollowups();
    }
  }

  private saveFollowups(): void {
    localStorage.setItem('followups', JSON.stringify(this.followups()));
  }

  getFollowups(): Followup[] {
    return this.followups();
  }

  getFollowupsByProject(projectId: string): Followup[] {
    return this.followups().filter(f => f.projectId === projectId);
  }

  getFollowupById(id: string): Followup | undefined {
    return this.followups().find(f => f.id === id);
  }

  createFollowup(followup: Omit<Followup, 'id' | 'createdAt' | 'updatedAt'>): Followup {
    const newFollowup: Followup = {
      ...followup,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.followups.set([...this.followups(), newFollowup]);
    this.saveFollowups();
    return newFollowup;
  }

  updateFollowup(id: string, updates: Partial<Followup>): Followup | null {
    const followups = this.followups();
    const index = followups.findIndex(f => f.id === id);
    if (index !== -1) {
      followups[index] = { 
        ...followups[index], 
        ...updates,
        updatedAt: new Date()
      };
      this.followups.set([...followups]);
      this.saveFollowups();
      return followups[index];
    }
    return null;
  }

  deleteFollowup(id: string): void {
    this.followups.set(this.followups().filter(f => f.id !== id));
    this.saveFollowups();
  }
}
