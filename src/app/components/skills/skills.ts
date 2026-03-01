import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

interface MainSkill {
  title: string;
  description: string;
  isMainCard?: boolean;
}

interface AuxiliarySkill {
  name: string;
}

@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills implements OnInit {
  @ViewChild('mainStack') mainStack: ElementRef | undefined;

  currentSlide = 0;

  mainSkills: MainSkill[] = [
    {
      title: 'FRONT END DEVELOPER',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      isMainCard: true,
    },
    {
      title: 'HTML / CSS / SASS',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    },
    {
      title: 'JavaScript / TypeScript',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    },
    {
      title: 'Angular / Vue',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    },
    {
      title: 'WP / WooCommerce',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    },
  ];

  auxiliarySkills: AuxiliarySkill[] = [
    { name: 'Figma' },
    { name: 'Python' },
    { name: 'Firebase' },
    { name: 'PHP' },
    { name: 'Docker' },
  ];

  ngOnInit(): void {
    this.setupScrollListener();
  }

  private setupScrollListener(): void {
    if (!this.mainStack) return;

    this.mainStack.nativeElement.addEventListener('scroll', () => {
      const element = this.mainStack?.nativeElement;
      if (!element) return;

      const scrollLeft = element.scrollLeft;
      const cardWidth = element.querySelector('.skill')?.offsetWidth || 0;
      const containerWidth = element.offsetWidth;

      // Calculate which card is in the center
      const centerPosition = scrollLeft + containerWidth / 2;
      const activeCard = Math.round(centerPosition / cardWidth);

      this.currentSlide = Math.max(0, Math.min(activeCard, 4));
    });
  }
}
