import type { PromiseKey } from "./membership";

/**
 * Photography for the membership section, from Unsplash (free under the Unsplash License, no
 * attribution required; the photo page is kept on each entry so credit is one lookup away).
 *
 * Hot-linked from Unsplash's image CDN for now. Before shipping, vendor these into /public/marketing
 * as WebP like the rest of the page's imagery, so the page has no third-party image dependency.
 *
 * Picked for the page's palette: low light, warm highlights that sit next to the yellow accent.
 */

export interface Photo {
  id: string;
  alt: string;
  /** The Unsplash photo page, for credit. */
  page: string;
}

export const PHOTOS = {
  goldenRun: {
    id: "photo-1603455778956-d71832eafa4e",
    alt: "A woman running at golden hour",
    page: "https://unsplash.com/photos/a6FHROHuQ9o",
  },
  videoCall: {
    id: "photo-1606770347238-77fcfd29906c",
    alt: "A laptop on a video call beside a mug of coffee",
    page: "https://unsplash.com/photos/fRGoTJFQAHM",
  },
  homeWorkout: {
    id: "photo-1571019613454-1cb2f99b2d8b",
    alt: "A woman doing sit-ups on a mat at home",
    page: "https://unsplash.com/s/photos/photo-1571019613454-1cb2f99b2d8b",
  },
  friendsTogether: {
    id: "photo-1529156069898-49953e39b3ac",
    alt: "A group of friends sitting arm in arm, looking out to sea",
    page: "https://unsplash.com/s/photos/photo-1529156069898-49953e39b3ac",
  },
} satisfies Record<string, Photo>;

/** The photograph behind each membership promise, shared by every version of the page. */
export const PROMISE_PHOTOS: Record<PromiseKey, Photo> = {
  companion: PHOTOS.goldenRun,
  coaches: PHOTOS.homeWorkout,
  community: PHOTOS.friendsTogether,
  founder: PHOTOS.videoCall,
};

/** A sized, compressed CDN URL. Unsplash resizes on the fly, so request only what the slot needs. */
export function photoUrl(photo: Photo, width: number, height?: number) {
  const size = height ? `&h=${height}&fit=crop` : "";
  return `https://images.unsplash.com/${photo.id}?auto=format&q=72&w=${width}${size}`;
}
