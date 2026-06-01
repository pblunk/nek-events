import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

type SavedItemsContextValue = {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
};

const SavedItemsContext = createContext<SavedItemsContextValue | undefined>(undefined);

export function SavedItemsProvider({ children }: PropsWithChildren) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      savedIds,
      isSaved: (id: string) => savedIds.includes(id),
      toggleSaved: (id: string) => {
        setSavedIds((currentIds) =>
          currentIds.includes(id) ? currentIds.filter((savedId) => savedId !== id) : [...currentIds, id],
        );
      },
    }),
    [savedIds],
  );

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>;
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);

  if (!context) {
    throw new Error('useSavedItems must be used within SavedItemsProvider');
  }

  return context;
}
