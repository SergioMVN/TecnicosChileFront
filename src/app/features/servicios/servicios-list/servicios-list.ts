import { Component, OnInit, signal } from '@angular/core';
import { Servicio } from '../../../models/Servicio';
import { ServiciosService } from '../servicios.service';
import { RouterLink } from '@angular/router';   // 👈 IMPORTANTE
import { CommonModule } from '@angular/common'; // 👈 para @for y pipes si los usas

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [RouterLink, CommonModule],  // 👈 AQUI SE ACTIVA routerLink
  templateUrl: './servicios-list.html',
  styleUrl: './servicios-list.css',
})
export class ServiciosList implements OnInit {

  servicios = signal<Servicio[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.serviciosService.getServicios().subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err)
        this.error.set('error al cargar los servicios');
        this.cargando.set(false);
      },
    });
  }
}
