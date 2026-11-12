// Icons available in the sprite. Each name is a <symbol id> in
// public/icons/sprite.svg: add the symbol there before adding the name here.
export const ICON_NAMES = ['at', 'github', 'linkedin'] as const;

export type IconName = (typeof ICON_NAMES)[number];

// Absolute, like the font URL: the site is served from the domain root.
export const ICON_SPRITE = '/icons/sprite.svg';
