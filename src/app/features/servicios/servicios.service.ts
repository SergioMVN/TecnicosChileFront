import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Servicio } from '../../models/Servicio';

@Injectable({
  providedIn: 'root',
})
export class ServiciosService {
  
  private apiUrl = 'http://localhost:5197/api/servicios';

  constructor(private http: HttpClient){}

    getServicios(): Observable<Servicio[]>{
      return this.http.get<Servicio[]>(this.apiUrl);
    }

    getServicio(id: number): Observable<Servicio>{
      return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
    } 

    crearServicio(dto: any){
      return this.http.post<Servicio>(this.apiUrl, dto);
    }
  }

