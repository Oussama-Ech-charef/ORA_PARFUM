export const SITE_CONFIG = {
  whatsappNumber: '212600000000',
  storeName: 'ORA PARFUM',
  contactPhone: '+212 600 000 000',
  contactEmail: 'contact@oraparfum.com',
  address: 'الدار البيضاء، المغرب',
};

export function getWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getInquiryWhatsAppUrl(): string {
  const msg = 'مرحباً، أود الاستفسار عن منتجات ORA PARFUM';
  return getWhatsAppUrl(SITE_CONFIG.whatsappNumber, msg);
}
