import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { Nav } from './nav';

describe('Nav', () => {
  const content = SITE_CONTENT[DEFAULT_LOCALE].shell;
  let fixture: ComponentFixture<Nav>;
  let host: HTMLElement;

  const toggle = () => host.querySelector<HTMLButtonElement>('.nav__toggle')!;
  const dialog = () => host.querySelector<HTMLDialogElement>('dialog')!;
  // <dialog> fires `close` in a task that a 0 ms timeout can still beat, so
  // give the browser a moment before reading the DOM back.
  const settle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nav],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Nav);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  afterEach(() => {
    if (dialog().open) {
      dialog().close();
    }
  });

  it('renders a banner with a labelled navigation', () => {
    expect(host.querySelector('header')).not.toBeNull();
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe(content.nav.ariaLabel);
  });

  it('links the logo to the main landmark, named after the product', () => {
    const logo = host.querySelector<HTMLAnchorElement>('.nav__logo');

    expect(logo?.getAttribute('href')).toBe('#main');
    expect(logo?.textContent).toBe('</dvprod7>');
  });

  it('links every section anchor, in content order', () => {
    const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('.nav__link'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      content.nav.links.map((link) => `#${link.sectionId}`),
    );
    expect(links.map((link) => link.textContent?.trim())).toEqual(
      content.nav.links.map((link) => `/ ${link.label}`),
    );
  });

  it('hides the decorative slashes from assistive tech', () => {
    const slashes = Array.from(host.querySelectorAll('.nav__slash, .menu__slash'));

    expect(slashes.length).toBe(content.nav.links.length * 2);
    for (const slash of slashes) {
      expect(slash.getAttribute('aria-hidden')).toBe('true');
    }
  });

  it('keeps the language switch out of the DOM while it is disabled', () => {
    expect(host.querySelector('.nav__lang')).toBeNull();
  });

  it('names the menu dialog and wires the toggle to it', () => {
    expect(dialog().getAttribute('aria-label')).toBe(content.menu.ariaLabel);
    expect(toggle().getAttribute('aria-controls')).toBe(dialog().id);
    expect(toggle().getAttribute('aria-label')).toBe(content.nav.openMenu);
    expect(host.querySelector('.menu__close')?.getAttribute('aria-label')).toBe(
      content.nav.closeMenu,
    );
  });

  it('opens the dialog and flips aria-expanded', async () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');

    toggle().click();
    await settle();

    expect(dialog().open).toBeTrue();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });

  it('closes from the close button', async () => {
    toggle().click();
    await settle();

    host.querySelector<HTMLButtonElement>('.menu__close')!.click();
    await settle();

    expect(dialog().open).toBeFalse();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes from the logo, which leads out of the menu', async () => {
    const logo = host.querySelector<HTMLAnchorElement>('.menu__logo')!;

    expect(logo.getAttribute('href')).toBe('#main');

    toggle().click();
    await settle();

    logo.click();
    await settle();

    expect(dialog().open).toBeFalse();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('closes from a menu link', async () => {
    toggle().click();
    await settle();

    host.querySelector<HTMLAnchorElement>('.menu__link')!.click();
    await settle();

    expect(dialog().open).toBeFalse();
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  // Escape is handled natively by <dialog>; it ends in the same close event.
  it('resets the toggle when the dialog closes on its own (Escape)', async () => {
    toggle().click();
    await settle();

    dialog().close();
    await settle();

    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the current year next to the fixed copyright text', () => {
    expect(host.querySelector('.menu__copyright')?.textContent?.trim()).toBe(
      `${content.menu.copyright} ${new Date().getFullYear()}`,
    );
  });
});
