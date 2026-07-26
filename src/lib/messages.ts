import { Message } from '@/types';

const MESSAGES_KEY = 'ora_messages';

export function getMessages(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(MESSAGES_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return [];
}

export function saveMessages(messages: Message[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
}

export function addMessage(message: Message): void {
  const messages = getMessages();
  messages.unshift(message);
  saveMessages(messages);
}

export function markAsRead(messageId: string): void {
  const messages = getMessages();
  const msg = messages.find((m) => m.id === messageId);
  if (msg) {
    msg.read = true;
    saveMessages(messages);
  }
}

export function markAllAsRead(): void {
  const messages = getMessages();
  messages.forEach((m) => { m.read = true; });
  saveMessages(messages);
}

export function deleteMessage(messageId: string): void {
  saveMessages(getMessages().filter((m) => m.id !== messageId));
}

export function getUnreadCount(): number {
  return getMessages().filter((m) => !m.read).length;
}
