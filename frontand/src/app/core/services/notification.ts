import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Notification,
  NotificationBadgeResponse,
  NotificationParametres,
  NotificationParametresUpdateRequest
} from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/notifications';

  envoyerManuellement(): Observable<Notification[]> {
    return this.http.post<Notification[]>(`${this.apiUrl}/envoyer`, {});
  }

  getHistorique(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/historique`);
  }

  getBadgeCount(): Observable<NotificationBadgeResponse> {
    return this.http.get<NotificationBadgeResponse>(`${this.apiUrl}/badge`);
  }

  updateParametres(payload: NotificationParametresUpdateRequest): Observable<NotificationParametres> {
    return this.http.put<NotificationParametres>(`${this.apiUrl}/parametres`, payload);
  }

  getParametres(): Observable<NotificationParametres> {
    return this.http.get<NotificationParametres>(`${this.apiUrl}/parametres`);
  }
}
