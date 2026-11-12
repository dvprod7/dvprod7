import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_LOCALE, SITE_CONTENT } from '../../core/content/site-content';
import { SocialLinks } from './social-links';

describe('SocialLinks', () => {
  const links = SITE_CONTENT[DEFAULT_LOCALE].socialLinks;
  let fixture: ComponentFixture<SocialLinks>;
  let host: HTMLElement;

  const anchors = () => Array.from(host.querySelectorAll<HTMLAnchorElement>('a'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialLinks],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialLinks);
    fixture.componentRef.setInput('links', links);
    await fixture.whenStable();
    host = fixture.nativeElement;
  });

  it('renders every link, in content order, as a list', () => {
    expect(host.querySelectorAll('ul > li').length).toBe(links.length);
    expect(anchors().map((a) => a.getAttribute('href'))).toEqual(links.map((l) => l.href));
  });

  it('names the icon-only links after their label', () => {
    expect(anchors().map((a) => a.getAttribute('aria-label'))).toEqual(links.map((l) => l.label));
    expect(anchors().map((a) => a.textContent?.trim())).toEqual(links.map(() => ''));
    expect(
      Array.from(host.querySelectorAll('use'), (use) => use.getAttribute('href')?.split('#')[1]),
    ).toEqual(links.map((l) => l.icon));
  });

  it('shows the label as text in the pill variant, without icons', async () => {
    fixture.componentRef.setInput('variant', 'pill');
    await fixture.whenStable();

    expect(anchors().map((a) => a.textContent?.trim())).toEqual(links.map((l) => l.label));
    expect(anchors().every((a) => !a.hasAttribute('aria-label'))).toBeTrue();
    expect(host.querySelector('app-icon')).toBeNull();
  });
});
