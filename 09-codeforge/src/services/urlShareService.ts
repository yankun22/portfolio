import type { SharePayload } from '../types/snippet';

export function encodeSharePayloadToUrl(payload: SharePayload): string {
  try {
    const jsonStr = JSON.stringify(payload);
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.hash = `share=${base64}`;
    return url.toString();
  } catch {
    return window.location.href;
  }
}

export function decodeSharePayloadFromUrl(): SharePayload | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('share=')) return null;

    const base64 = hash.split('share=')[1];
    if (!base64) return null;

    const jsonStr = decodeURIComponent(atob(base64));
    return JSON.parse(jsonStr) as SharePayload;
  } catch {
    return null;
  }
}
