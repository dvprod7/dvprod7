import { Component, signal } from '@angular/core';
import { Navbar } from './components/navbar/navbar';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Skills } from './components/skills/skills';
/* import { RouterOutlet } from '@angular/router'; */

@Component({
  selector: 'app-root',
  /* imports: [RouterOutlet], */
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Navbar, Hero, About, Skills],
})
export class App {
  protected readonly title = signal('dvprod7-app');
}
