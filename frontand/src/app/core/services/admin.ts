import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type UserRole = 'chef' | 'admin' | 'pilote';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateAdminUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}

export interface Nomenclature {
  id: string;
  category: string;
  code: string;
  label: string;
  description: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNomenclatureRequest {
  category: string;
  code: string;
  label: string;
  description?: string;
  sortOrder: number;
  active: boolean;
}

export interface UpdateNomenclatureRequest {
  category?: string;
  code?: string;
  label?: string;
  description?: string;
  sortOrder?: number;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/admin';

  listUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  createUser(payload: CreateAdminUserRequest): Observable<AdminUser> {
    return this.http.post<AdminUser>(`${this.apiUrl}/users`, payload);
  }

  updateUser(userId: string, payload: UpdateAdminUserRequest): Observable<AdminUser> {
    return this.http.put<AdminUser>(`${this.apiUrl}/users/${userId}`, payload);
  }

  updateUserRole(userId: string, role: UserRole): Observable<AdminUser> {
    return this.http.patch<AdminUser>(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  listNomenclatures(category?: string): Observable<Nomenclature[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.http.get<Nomenclature[]>(`${this.apiUrl}/nomenclatures${query}`);
  }

  createNomenclature(payload: CreateNomenclatureRequest): Observable<Nomenclature> {
    return this.http.post<Nomenclature>(`${this.apiUrl}/nomenclatures`, payload);
  }

  updateNomenclature(id: string, payload: UpdateNomenclatureRequest): Observable<Nomenclature> {
    return this.http.put<Nomenclature>(`${this.apiUrl}/nomenclatures/${id}`, payload);
  }

  deleteNomenclature(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nomenclatures/${id}`);
  }
}
