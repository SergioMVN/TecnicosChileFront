import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';
import { finalize } from 'rxjs/operators';   // 👈 IMPORTANTE

@Component({
  selector: 'app-servicio-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicio-form.html',
  styleUrl: './servicio-form.css',
})
export class ServicioForm {

  creando = false;
  error: string | null = null;
  mensajeOk: string | null = null;

  modalConfirmAbierto = false;
  modalResultadoAbierto = false;

  // 👇 guardamos el id del servicio creado para ir al detalle
  servicioCreadoId: number | null = null;

  form;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      categoria: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  // 👉 Abre modal de confirmación
  abrirConfirmacion() {
    if (this.form.invalid) return;
    this.modalConfirmAbierto = true;
  }

  cerrarConfirmacion() {
    this.modalConfirmAbierto = false;
  }

  // 👉 Al confirmar en el modal
  confirmarCreacion() {
    this.modalConfirmAbierto = false;
    this.crearServicio();
  }

  private crearServicio() {
    if (this.creando) return; // evita doble envío

    this.creando = true;
    this.error = null;
    this.mensajeOk = null;
    this.servicioCreadoId = null;

    console.log('☑️ Enviando servicio al backend...', this.form.value);

    this.serviciosService.crearServicio(this.form.value)
      .pipe(
        // ✅ SIEMPRE se ejecuta (éxito o error)
        finalize(() => {
          this.creando = false;
        })
      )
      .subscribe({
        next: (resp: any) => {
          console.log('✅ RESPUESTA DEL BACKEND:', resp);

          // asumimos que el backend devuelve el id del servicio creado
          this.servicioCreadoId = resp.id;
          this.mensajeOk = 'Servicio creado con éxito';
          this.modalResultadoAbierto = true;

          // 🔥 redirección automática al detalle después de un pequeño delay
          setTimeout(() => {
            this.irADetalleServicio();
          }, 1500);
        },
        error: (err) => {
          console.error('❌ ERROR EN BACKEND:', err);
          this.error = 'Error al crear el servicio.';
          this.modalResultadoAbierto = true;
        }
      });
  }

  // 👉 función central para ir al detalle
  private irADetalleServicio() {
    if (this.servicioCreadoId == null) return;

    this.modalResultadoAbierto = false;

    // ⚠️ Ajusta esta ruta según tu configuración:
    // por ejemplo, si tienes path: 'servicios/:id'
    this.router.navigate(['/servicios', this.servicioCreadoId]);
  }

  // 👉 si el usuario hace clic en "Cerrar" antes de que pase el timeout
  cerrarResultado() {
    this.irADetalleServicio();
  }
}
