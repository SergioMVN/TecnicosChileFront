import { Routes } from '@angular/router';
import { ServiciosList } from './features/servicios/servicios-list/servicios-list';
import { ServicioDetail } from './features/servicios/servicio-detail/servicio-detail';
import { ServicioForm } from './features/servicios/servicio-form/servicio-form';
import { Login } from './features/auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  // Login SIN layout
  { path: 'login', component: Login },

  // Todo lo demás envuelto en el layout
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'servicios', pathMatch: 'full' },

      // 👉 Listado de servicios (pública por ahora)
      { path: 'servicios', component: ServiciosList },

      // 👉 Crear servicio
      { path: 'servicios/crear', component: ServicioForm },

      // 👉 Detalle de un servicio
      { path: 'servicios/:id', component: ServicioDetail },
    ],
  },

  // 👉 Cualquier ruta rara → raíz (que usa layout)
  { path: '**', redirectTo: '' },
];
