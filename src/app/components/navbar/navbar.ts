import { Component } from '@angular/core';
import { Socials } from '../socials/socials';

@Component({
  selector: 'app-navbar',
  imports: [Socials],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isMenuOpen = false;
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
