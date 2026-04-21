import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notification, NotificationCanal, NotificationStatut } from '../../../models/notification.model';
import { Auth } from '../../../services/auth';
import { NotificationService } from '../../../services/notification';

@Component({
  selector: 'app-notifications-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications-historique.html',
  styleUrl: './notifications-historique.css'
})
export class NotificationsHistoriqueComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private auth = inject(Auth);
  readonly defaultVisibleNotifications = 5;

  historique: Notification[] = [];
  loading = false;
  envoiManuelEnCours = false;
  sauvegardeParametresEnCours = false;
  delaiJours = 3;
  paramsUpdatedAt: string | null = null;
  successMessage = '';
  errorMessage = '';
  searchTerm = '';
  statutFilter: 'ALL' | NotificationStatut = 'ALL';
  canalFilter: 'ALL' | NotificationCanal = 'ALL';
  triggerFilter: 'ALL' | 'MANUEL' | 'AUTO' = 'ALL';
  visibleNotifications = this.defaultVisibleNotifications;

  ngOnInit(): void {
    this.chargerDonnees();
  }

  get isPiloteQualite(): boolean {
    return this.auth.hasRole('pilote');
  }

  get totalNotifications(): number {
    return this.historique.length;
  }

  get sentCount(): number {
    return this.historique.filter((notification) => notification.statut === 'ENVOYE').length;
  }

  get failedCount(): number {
    return this.historique.filter((notification) => notification.statut === 'ECHEC').length;
  }

  get pendingCount(): number {
    return this.historique.filter((notification) => notification.statut === 'EN_ATTENTE').length;
  }

  get filteredHistorique(): Notification[] {
    return this.historique.filter((notification) => {
      const term = this.searchTerm.trim().toLowerCase();
      const matchesTerm = !term
        || notification.projetNom.toLowerCase().includes(term)
        || (notification.chefProjetEmail ?? '').toLowerCase().includes(term)
        || (notification.ficheId ?? '').toLowerCase().includes(term);

      const matchesStatut = this.statutFilter === 'ALL' || notification.statut === this.statutFilter;
      const matchesCanal = this.canalFilter === 'ALL' || notification.canal === this.canalFilter;
      const matchesTrigger = this.triggerFilter === 'ALL'
        || (this.triggerFilter === 'MANUEL' && notification.envoyeParPilote)
        || (this.triggerFilter === 'AUTO' && !notification.envoyeParPilote);

      return matchesTerm && matchesStatut && matchesCanal && matchesTrigger;
    });
  }

  get displayedHistorique(): Notification[] {
    return this.filteredHistorique.slice(0, this.visibleNotifications);
  }

  get hasMoreNotifications(): boolean {
    return this.displayedHistorique.length < this.filteredHistorique.length;
  }

  get canShowLess(): boolean {
    return !this.hasMoreNotifications && this.filteredHistorique.length > this.defaultVisibleNotifications;
  }

  chargerDonnees(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.chargerHistorique();
    this.chargerParametres();
  }

  envoyerMaintenant(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.envoiManuelEnCours = true;

    this.notificationService.envoyerManuellement().subscribe({
      next: (notifications) => {
        this.envoiManuelEnCours = false;
        this.successMessage = `${notifications.length} notification(s) traitee(s) avec succes.`;
        this.chargerHistorique();
      },
      error: () => {
        this.envoiManuelEnCours = false;
        this.errorMessage = "L'envoi manuel a echoue.";
      }
    });
  }

  enregistrerParametres(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.delaiJours < 1) {
      this.errorMessage = 'Le delai doit etre superieur ou egal a 1 jour.';
      return;
    }

    this.sauvegardeParametresEnCours = true;
    this.notificationService.updateParametres({ delaiJours: this.delaiJours }).subscribe({
      next: (params) => {
        this.sauvegardeParametresEnCours = false;
        this.delaiJours = params.delaiJours;
        this.paramsUpdatedAt = params.updatedAt;
        this.successMessage = 'Parametres de notification mis a jour.';
      },
      error: () => {
        this.sauvegardeParametresEnCours = false;
        this.errorMessage = 'La mise a jour du delai a echoue.';
      }
    });
  }

  getBadgeClass(statut: NotificationStatut): string {
    if (statut === 'ENVOYE') {
      return 'bg-success';
    }
    if (statut === 'ECHEC') {
      return 'bg-danger';
    }
    return 'bg-warning text-dark';
  }

  getCanalClass(canal: Notification['canal']): string {
    if (canal === 'EMAIL_SMS') {
      return 'pill-canal pill-canal-combo';
    }
    if (canal === 'EMAIL') {
      return 'pill-canal pill-canal-email';
    }
    return 'pill-canal pill-canal-sms';
  }

  trackByNotificationId(_: number, notification: Notification): string {
    return notification.id;
  }

  onFiltersChange(): void {
    this.visibleNotifications = this.defaultVisibleNotifications;
  }

  private chargerHistorique(): void {
    this.loading = true;
    this.notificationService.getHistorique().subscribe({
      next: (historique) => {
        this.historique = historique;
        this.visibleNotifications = this.defaultVisibleNotifications;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = "Impossible de charger l'historique des notifications.";
      }
    });
  }

  private chargerParametres(): void {
    this.notificationService.getParametres().subscribe({
      next: (params) => {
        this.delaiJours = params.delaiJours;
        this.paramsUpdatedAt = params.updatedAt;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les parametres de notification.';
      }
    });
  }

  showMore(): void {
    this.visibleNotifications += this.defaultVisibleNotifications;
  }

  showLess(): void {
    this.visibleNotifications = this.defaultVisibleNotifications;
  }
}
