/**
 * Unsplash photo IDs used across the marketing page, in one place so they are
 * easy to swap for real property photography later. Sized/cropped via query
 * params; `next/image` still handles responsive delivery.
 */
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const UNSPLASH = {
  heroInterior: u("photo-1502672260266-1c1ef2d93688", 700),
  livingRoom: u("photo-1586023492125-27b2c045efd7", 1100),
  kitchen: u("photo-1484154218962-a197022b5858", 1100),
  interiorArt: u("photo-1505691938895-1758d7feb511", 900),
  exterior: u("photo-1512917774080-9991f1c4c750", 900),
  loungeBlue: u("photo-1493809842364-78817add7ffb", 900),
  apartment: u("photo-1522708323590-d24dbb6b0267", 900),
} as const;

/** Portraits for the testimonial wall. Replace with real customer photos. */
export const PORTRAIT = {
  priya: u("photo-1494790108377-be9c29b29330", 160),
  marcus: u("photo-1500648767791-00dcc994a43e", 160),
  hannah: u("photo-1438761681033-6461ffad8d80", 160),
  tomas: u("photo-1472099645785-5658abf4ff4e", 160),
  aisha: u("photo-1544005313-94ddf0286df2", 160),
  daniel: u("photo-1507003211169-0a1dd7228f2d", 160),
} as const;
