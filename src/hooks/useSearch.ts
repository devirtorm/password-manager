import { useState, useMemo } from 'react';

interface UseSearchProps<T> {
  items: T[];
  searchFields: (keyof T)[];
}

export function useSearch<T>({ items, searchFields }: UseSearchProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term);
        }
        return false;
      })
    );
  }, [items, searchTerm, searchFields]);

  const hasItems = items.length > 0;
  const hasFilteredResults = filteredItems.length > 0;
  const isSearching = searchTerm.length > 0;
  const showEmptySearch = isSearching && !hasFilteredResults;
  const showEmptyState = !hasItems && !isSearching;

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    hasItems,
    hasFilteredResults,
    isSearching,
    showEmptySearch,
    showEmptyState,
  };
}
