'use client';

import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { searchBooks } from '@/shared/api/aladin/aladinApi';

/**
 * 책 검색 Custom Hook
 */
export function useBookSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // 디바운싱 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // 검색 쿼리 (react-query)
  const {
    data: books = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['books', 'search', debouncedQuery],
    queryFn: () =>
      searchBooks({
        query: debouncedQuery,
        queryType: 'Keyword',
        maxResults: 20,
      }),
    enabled: debouncedQuery.length >= 2, // 2글자 이상일 때만 검색
    staleTime: 5 * 60 * 1000, // 5분간 캐시
  });

  // 검색어 변경 핸들러
  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  return {
    query,
    books,
    isLoading,
    error,
    handleQueryChange,
  };
}
