import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'chef' | 'admin' | 'pilote';
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'chef' | 'admin' | 'pilote';
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/auth';

  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal(false);

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email: normalizedEmail, password }).pipe(
      tap((res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  register(payload: RegisterRequest): Observable<LoginResponse> {
    const normalizedPayload: RegisterRequest = {
      ...payload,
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase()
    };
    return this.http.post<LoginResponse>(`${this.API_URL}/register`, normalizedPayload).pipe(
      tap((res) => {
        localStorage.setItem('token', res.accessToken);
        localStorage.setItem('user', JSON.stringify(res.user));
        this.currentUser.set(res.user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
