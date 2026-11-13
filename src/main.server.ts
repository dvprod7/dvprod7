// Build-time entry only: the prerenderer renders the page through it. There is
// no server in production (outputMode "static" in angular.json).
import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
