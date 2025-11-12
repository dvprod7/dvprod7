import { Component, signal } from '@angular/core';
import { Navbar } from "./components/navbar/navbar";
/* import { RouterOutlet } from '@angular/router'; */

@Component({
  selector: 'app-root',
  /* imports: [RouterOutlet], */
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [Navbar]
})
export class App {
  protected readonly title = signal('dvprod7-app');
}
