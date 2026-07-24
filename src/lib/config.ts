export const SITE_CONFIG = {
  whatsappNumber: '212639860777',
  storeName: 'ORA PARFUM',
  contactPhone: '+212 639 860 777',
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
