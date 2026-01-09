import { Component, signal } from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
import { Hero } from "./components/hero/hero";
/* import { RouterOutlet } from '@angular/router'; */

@Component({
  selector: 'app-root',
  /* imports: [RouterOutlet], */
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Navbar, Hero]
})
export class App {
  protected readonly title = signal('dvprod7-app');
}
