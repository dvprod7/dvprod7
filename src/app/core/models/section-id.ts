// Page sections reachable from the nav, in page order. Each id is also the
// section's anchor (`#about`), so it must stay stable.
export const SECTION_IDS = ['about', 'skills', 'projects', 'contact'] as const;

export type SectionId = (typeof SECTION_IDS)[number];
