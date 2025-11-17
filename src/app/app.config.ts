import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    // 👇 Aquí se configura HttpClient
    provideHttpClient(
      withFetch(),                       // Usar fetch en Angular
      withInterceptors([authInterceptor]) // Agregar interceptor JWT
    ),

    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
