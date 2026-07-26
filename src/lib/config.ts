import { getSettings } from './settings';

export function getWhatsappNumber(): string {
  return getSettings().whatsappNumber;
}
