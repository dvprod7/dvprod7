import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { applySeo } from './core/seo/seo';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // The page is prerendered: the browser hydrates that HTML instead of
    // re-rendering it, and replays clicks that land before hydration ends.
    provideClientHydration(withEventReplay()),
    // <head> tags from the content layer, baked in by the prerender.
    provideAppInitializer(applySeo),
  ],
};
