import { Component } from '@angular/core';
import { Socials } from '../socials/socials';

@Component({
  selector: 'app-hero',
  imports: [Socials],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
