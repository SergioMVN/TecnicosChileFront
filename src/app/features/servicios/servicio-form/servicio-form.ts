import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiciosService } from '../servicios.service';

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

  form; // 👈 se declara pero NO se inicializa aquí

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService,
    private router: Router
  ) {
    // 👇 y aquí se inicializa correctamente
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      categoria: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.creando = true;
    this.error = null;

    this.serviciosService.crearServicio(this.form.value).subscribe({
      next: () => {
        this.creando = false;
        this.mensajeOk = 'Servicio creado correctamente';
      },
      error: () => {
        this.creando = false;
        this.error = 'Error al crear el servicio.';
      }
    });
  }
}
