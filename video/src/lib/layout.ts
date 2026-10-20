/** The video canvas: 9:16 for Reels, Shorts and TikTok. */
export const W = 1080;
export const H = 1920;

/**
 * Where text may go. Reels, Shorts and TikTok lay their own UI over the frame (the profile row
 * and caption at the bottom, the header at the top, the action rail on the right), so every word
 * of copy stays inside this box. Phones and backgrounds may run past it; copy never does.
 */
export const SAFE = { top: 260, bottom: 1440, left: 100, right: 980 } as const;

export const INK = "#0B0B0B";
export const PAPER = "#F4F4F2";
export const YELLOW = "#FFDE59";

/** The cast. Fictional people; Sade's portrait is the mockups' placeholder stock photo. */
export const SADE = { first: "Sade", full: "Sade Okoye", photo: "members/s.jpg" };
export const DAMI = { first: "Dami", full: "Dami Adebayo", email: "dami@adebayo.me" };
export const GOAL = { title: "Run a half marathon", period: "2026 Q4", due: "Due Nov 8", dueLong: "November 8, 2026" };
export const REPLY = "Look at you go! Saturday long run?";
