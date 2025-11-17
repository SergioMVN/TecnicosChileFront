import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../servicios.service';
import { Servicio } from '../../../models/Servicio';

@Component({
  selector: 'app-servicio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.css'
})
export class ServicioDetail implements OnInit {

  // 👇 estas propiedades son las que usa el HTML
  servicio = signal<Servicio | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private serviciosService: ServiciosService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.error.set('No se proporcionó un ID de servicio.');
      this.cargando.set(false);
      return;
    }

    const id = Number(idParam);

    this.serviciosService.getServicio(id).subscribe({
      next: (s) => {
        this.servicio.set(s);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el servicio.');
        this.cargando.set(false);
      }
    });
  }
}
