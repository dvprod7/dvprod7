import { RenderMode, ServerRoute } from '@angular/ssr';

// Single page, no router: everything is prerendered to static HTML at build
// time. Adding /es later (phase 6) means a route here, still prerendered.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
