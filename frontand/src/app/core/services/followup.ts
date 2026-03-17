import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type MaintenanceRequestType = 'anomalie' | 'amelioration' | 'nouveau-besoin';

export interface Followup {
  id: string;
  projectId: string;
  title: string;
  description: string;
  progress: number;
  issues?: string;
  decisions?: string;
  reportDate?: string;
  contractReference?: string;
  requester?: string;
  requestType?: MaintenanceRequestType;
  procedureConcerned?: string;
  attachments?: string;
  feasibility?: 'oui' | 'non';
  deliveryType?: 'version' | 'patch';
  diagnosticComment?: string;
  estimatedCharge?: string;
  estimatedDelay?: string;
  decisionRmap?: 'oui' | 'non';
  decisionDate?: string;
  sourceRequestDate?: string;
  sourceReceptionDate?: string;
  devEnvRequestDate?: string;
  devEnvOpenDate?: string;
  workSummary?: string;
  versionNumber?: string;
  testEnvRequestDate?: string;
  testEnvOpenDate?: string;
  workEndDate?: string;
  packageSendDate?: string;
  closureObservation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowupPayload {
  title: string;
  description: string;
  progress: number;
  issues?: string;
  decisions?: string;
  reportDate?: string;
  contractReference?: string;
  requester?: string;
  requestType?: MaintenanceRequestType;
  procedureConcerned?: string;
  attachments?: string;
  feasibility?: 'oui' | 'non';
  deliveryType?: 'version' | 'patch';
  diagnosticComment?: string;
  estimatedCharge?: string;
  estimatedDelay?: string;
  decisionRmap?: 'oui' | 'non';
  decisionDate?: string;
  sourceRequestDate?: string;
  sourceReceptionDate?: string;
  devEnvRequestDate?: string;
  devEnvOpenDate?: string;
  workSummary?: string;
  versionNumber?: string;
  testEnvRequestDate?: string;
  testEnvOpenDate?: string;
  workEndDate?: string;
  packageSendDate?: string;
  closureObservation?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FollowupService {
  private http = inject(HttpClient);
  private readonly API_ROOT = 'http://localhost:8080/api/projects';

  listFollowups(projectId: string): Observable<Followup[]> {
    return this.http.get<Followup[]>(`${this.API_ROOT}/${projectId}/followups`);
  }

  getFollowupById(projectId: string, id: string): Observable<Followup> {
    return this.http.get<Followup>(`${this.API_ROOT}/${projectId}/followups/${id}`);
  }

  createFollowup(projectId: string, payload: FollowupPayload): Observable<Followup> {
    return this.http.post<Followup>(`${this.API_ROOT}/${projectId}/followups`, payload);
  }

  updateFollowup(projectId: string, id: string, payload: FollowupPayload): Observable<Followup> {
    return this.http.put<Followup>(`${this.API_ROOT}/${projectId}/followups/${id}`, payload);
  }

  deleteFollowup(projectId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_ROOT}/${projectId}/followups/${id}`);
  }
}
