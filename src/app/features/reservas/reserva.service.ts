import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface CrearReservaRequest {
  servicioId: number;
  fecha: string;   // ISO string
  estado?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReservaService {

  private http = inject(HttpClient);
  
  
  private apiUrl = `${environment.apiUrl}/reservas`;

  crearReserva(servicioId: number, fecha: Date): Observable<any> {
    const body: CrearReservaRequest = {
      servicioId,
      fecha: fecha.toISOString(),
      estado: 'Pendiente', // importante porque tu API espera Estado
    };

    return this.http.post(this.apiUrl, body);
  }
}
