import { useCallback, useEffect, useState } from 'react';

import { getSavedEventIds, saveEventIds } from '@/services/savedEvents';

export function useSavedEvents() {
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);

  useEffect(() => {
    getSavedEventIds().then(setSavedEventIds);
  }, []);

  const toggleSavedEvent = useCallback((eventId: string) => {
    setSavedEventIds((currentIds) => {
      const nextIds = currentIds.includes(eventId)
        ? currentIds.filter((id) => id !== eventId)
        : [...currentIds, eventId];

      saveEventIds(nextIds);
      return nextIds;
    });
  }, []);

  return {
    savedEventIds,
    toggleSavedEvent,
  };
}
