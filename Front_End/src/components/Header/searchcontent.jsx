import { createContext, useState, useContext, useEffect } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [hideSearch, setHideSearch] = useState(() => {
    const saved = localStorage.getItem('hideSearch');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('hideSearch', JSON.stringify(hideSearch));
  }, [hideSearch]);

  return (
    <SearchContext.Provider value={{ hideSearch, setHideSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}