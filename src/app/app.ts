import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Contact } from './components/contact/contact';
import { Projects } from './components/projects/projects';
import { DEFAULT_LOCALE, SITE_CONTENT } from './core/content/site-content';
import { About } from './sections/about/about';
import { Footer } from './sections/footer/footer';
import { Hero } from './sections/hero/hero';
import { Nav } from './sections/nav/nav';
import { Skills } from './sections/skills/skills';

@Component({
  selector: 'app-root',
  imports: [Nav, Hero, About, Skills, Projects, Contact, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly content = SITE_CONTENT[DEFAULT_LOCALE].shell;
}
