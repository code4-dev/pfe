export type NotificationType = 'RETARD_FICHE_SUIVI';
export type NotificationCanal = 'EMAIL' | 'SMS' | 'EMAIL_SMS';
export type NotificationStatut = 'ENVOYE' | 'ECHEC' | 'EN_ATTENTE';

export interface Notification {
  id: string;
  ficheId: string;
  chefProjetId: string;
  chefProjetEmail: string;
  chefProjetPhone?: string | null;
  projetNom: string;
  type: NotificationType;
  canal: NotificationCanal;
  statut: NotificationStatut;
  message: string;
  erreur?: string | null;
  dateEnvoi: string;
  envoyeParPilote: boolean;
  piloteId?: string | null;
}

export interface NotificationParametres {
  delaiJours: number;
  updatedAt: string;
}

export interface NotificationParametresUpdateRequest {
  delaiJours: number;
}

export interface NotificationBadgeResponse {
  count: number;
}
