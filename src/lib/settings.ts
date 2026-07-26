import { SiteSettings } from '@/types';
import { defaultSettings } from '@/data/settings';

const SETTINGS_KEY = 'ora_settings';

export function getSettings(): SiteSettings {
  if (typeof window === 'undefined') return { ...defaultSettings };
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...defaultSettings };
}

export function saveSettings(settings: SiteSettings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }
}
