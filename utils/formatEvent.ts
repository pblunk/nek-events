import { Event } from '@/types/event';

export function getEventLocation(event: Event) {
  return `${event.venue}, ${event.town}`;
}
