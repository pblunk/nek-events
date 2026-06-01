import { EventItem } from '@/types/guide';

export function getEventLocation(event: EventItem) {
  return `${event.location.name}, ${event.location.town}`;
}

export function formatEventDateRange(event: EventItem) {
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

export function formatEventTimeRange(event: EventItem) {
  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  const startTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(start);

  const endTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(end);

  return `${startTime}-${endTime}`;
}

export function formatEventFullDate(event: EventItem) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(event.startDate));
}
