declare global {
  interface Window {
    plausible?: (event: string, options?: Record<string, unknown>) => void;
  }
}

export function trackEvent(event: string, options?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(event, options);
  }
}
