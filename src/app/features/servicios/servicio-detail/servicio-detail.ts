import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServiciosService } from '../servicios.service';
import { Servicio } from '../../../models/Servicio';
import { ReservaService } from '../../reservas/reserva.service';

@Component({
  selector: 'app-servicio-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicio-detail.html',
  styleUrl: './servicio-detail.css'
})
export class ServicioDetail implements OnInit {

  // 🔹 Datos del servicio
  servicio = signal<Servicio | null>(null);
  cargando = signal(true);

  // 🔹 Error SOLO de CARGA del servicio
  error = signal<string | null>(null);

  // 🔹 Estado de creación de reserva
  creandoReserva = signal(false);

  // 🔹 Mensajes de RESERVA (no de carga)
  mensajeOk = signal<string | null>(null);
  reservaError = signal<string | null>(null);

  // 🔹 Modal
  modalAbierto = signal(false);
  modalTitulo = signal<string>('');
  modalEsError = signal(false);
  modalConfirmAbierto = signal(false);

  constructor(
    private route: ActivatedRoute,
    private serviciosService: ServiciosService,
    private reservaService: ReservaService
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
        // ⬅️ ESTE error es SOLO de CARGA
        this.error.set('No se pudo cargar el servicio.');
        this.cargando.set(false);
      }
    });
  }

  private abrirModal(titulo: string, esError: boolean) {
    this.modalTitulo.set(titulo);
    this.modalEsError.set(esError);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  contratar() {
  // solo abre el modal de confirmación
  this.modalConfirmAbierto.set(true);
}

private crearReserva() {
  const s = this.servicio();
  if (!s) return;

  this.creandoReserva.set(true);
  this.mensajeOk.set(null);
  this.reservaError.set(null);   // limpiamos errores de reserva

  const ahora = new Date();

  this.reservaService.crearReserva(s.id, ahora).subscribe({
    next: () => {
      this.creandoReserva.set(false);
      this.mensajeOk.set('Reserva creada correctamente ✅');
      this.abrirModal('Reserva creada', false);
    },
    error: (err: any) => {
      this.creandoReserva.set(false);
      console.error(err);

      if (err.status === 400 && err.error === 'Este servicio ya tiene una reserva activa.') {
        this.reservaError.set('Este servicio ya fue reservado y no está disponible.');
      } else if (err.status === 403) {
        this.reservaError.set('No tienes permisos para crear reservas. Inicia sesión como Cliente.');
      } else {
        this.reservaError.set('Ocurrió un error al crear la reserva.');
      }

      this.mensajeOk.set(null);
      this.abrirModal('No se pudo crear la reserva', true);
    }
  });
}

abrirConfirmacion() {
  this.modalConfirmAbierto.set(true);
}

cerrarConfirmacion() {
  this.modalConfirmAbierto.set(false);
}

confirmarContratacion() {
  this.modalConfirmAbierto.set(false);
  this.crearReserva();   // aquí recién llamamos al backend
}

    
  
}
