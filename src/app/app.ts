import { ChangeDetectionStrategy, Component } from '@angular/core';

import { About } from './components/about/about';
import { Contact } from './components/contact/contact';
import { Hero } from './components/hero/hero';
import { Projects } from './components/projects/projects';
import { Skills } from './components/skills/skills';
import { DEFAULT_LOCALE, SITE_CONTENT } from './core/content/site-content';
import { Footer } from './sections/footer/footer';
import { Nav } from './sections/nav/nav';

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
