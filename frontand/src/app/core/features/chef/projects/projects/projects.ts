import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../../services/project';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects implements OnInit {
 private projectService = inject(ProjectService);
  
  // 1. On garde uniquement les signaux pour les filtres
  filterStatus = signal<string>('all');
  searchText = signal<string>('');

  // 2. Le "computed" s'occupe de TOUT le filtrage automatiquement
  filteredProjects = computed(() => {
    const allProjects = this.projectService.getProjects(); // On lit le signal du service
    const status = this.filterStatus();
    const search = this.searchText().toLowerCase().trim();

    return allProjects.filter(p => {
      const matchesStatus = status === 'all' || p.status.toLowerCase() === status.toLowerCase();
      const matchesSearch = !search || 
                            p.name.toLowerCase().includes(search) || 
                            p.description.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });
  });

  ngOnInit(): void {
    // 3. On appelle le backend une seule fois au démarrage
    this.projectService.refreshProjects();
  }

  // 4. Les actions mettent juste à jour les signaux de filtre
  onFilterChange(status: string): void {
    this.filterStatus.set(status);
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
  }

  deleteProject(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      this.projectService.deleteProject(id);
      // Le signal du service se mettra à jour, donc filteredProjects se recalculera seul.
    }
  }

  // 5. Helpers pour l'affichage (assure-toi que les clés correspondent aux données du back)
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'planification': 'Planification',
      'en-cours': 'En cours',
      'termine': 'Terminé',
      'suspendu': 'Suspendu'
    };
    return labels[status.toLowerCase()] || status;
  }

  getStatusClass(status: string): string {
    // Transforme "En cours" en "en-cours" pour le CSS
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  }
}