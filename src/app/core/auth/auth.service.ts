import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  mensaje: string;
  email: string;
  rol: string;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = 'http://localhost:5197/api/auth';
  private platformId = inject(PLATFORM_ID);

  isAuthenticated = signal<boolean>(false);
  userEmail = signal<string | null>(null);
  userRole = signal<string | null>(null);

  constructor(private http: HttpClient) {

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      const rol = localStorage.getItem('rol');

      if (token) {
        this.isAuthenticated.set(true);
        this.userEmail.set(email);
        this.userRole.set(rol);
      }
    }
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('email', res.email);
          localStorage.setItem('rol', res.rol);
        }

        this.isAuthenticated.set(true);
        this.userEmail.set(res.email);
        this.userRole.set(res.rol);
      })
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('rol');
    }

    this.isAuthenticated.set(false);
    this.userEmail.set(null);
    this.userRole.set(null);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }

  // 👇👇👇 MÉTODOS NUEVOS PARA EL LAYOUT 👇👇👇

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getRole(): string | null {
    return this.userRole();
  }

  getName(): string | null {
    return this.userEmail();
  }
}
