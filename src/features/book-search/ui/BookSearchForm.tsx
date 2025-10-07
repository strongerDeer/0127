'use client';

import type { AladinBook } from '@/shared/types/aladin';

import { useBookSearch } from '../model/useBookSearch';
import { BookSearchFormUI } from './BookSearchFormUI';

interface BookSearchFormProps {
  onSelectBook: (book: AladinBook) => void;
}

/**
 * 책 검색 Container 컴포넌트
 */
export function BookSearchForm({ onSelectBook }: BookSearchFormProps) {
  const { query, books, isLoading, error, handleQueryChange } = useBookSearch();

  return (
    <BookSearchFormUI
      query={query}
      books={books}
      isLoading={isLoading}
      error={error}
      onQueryChange={handleQueryChange}
      onSelectBook={onSelectBook}
    />
  );
}
