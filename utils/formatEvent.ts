import { Event } from '@/types/event';

export function getEventLocation(event: Event) {
  return `${event.venue.name}, ${event.town}`;
}

export function formatEventDateRange(event: Event) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const date = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(start);

  const startTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(start);

  const endTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(end);

  return `${date} · ${startTime}-${endTime}`;
}
