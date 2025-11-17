// ... imports de antes
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
})
export class MainLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // 👇 estado del modal de confirmación
  showLogoutConfirm = false;

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  esTecnicoOAdmin() {
    const role = this.auth.getRole();
    return role === 'Tecnico' || role === 'Admin';
  }

  getNombreUsuario(): string {
    return this.auth.getName() ?? 'Usuario';
  }

  getRolUsuario(): string {
    return this.auth.getRole() ?? 'Invitado';
  }

  getInicialUsuario(): string {
    const name = this.getNombreUsuario();
    return name.trim().charAt(0).toUpperCase();
  }

  // 👉 abrir modal
  openLogoutConfirm() {
    this.showLogoutConfirm = true;
  }

  // 👉 cerrar modal sin hacer logout
  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  // 👉 confirmar logout
  confirmLogout() {
    this.showLogoutConfirm = false;
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
