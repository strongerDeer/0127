'use client';

import { useQuery } from '@tanstack/react-query';

import { bookRepository, userBookRepository } from '@/shared/api';
import type { UserBookWithBook } from '@/shared/types/book';

/**
 * 내 서재 조회 Custom Hook
 */
export function useMyBooks(userId: string) {
  const {
    data: userBooks = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['myBooks', userId],
    queryFn: async () => {
      // 1. 내 책 목록 조회 (비공개 포함)
      const books = await userBookRepository.getByUserId(userId, true);

      // 2. 각 책의 상세 정보 조회 (books 컬렉션)
      const booksWithDetails: UserBookWithBook[] = await Promise.all(
        books.map(async (userBook) => {
          const bookDetail = await bookRepository.getByIsbn(userBook.isbn);
          return {
            ...userBook,
            book: bookDetail!,
          };
        })
      );

      return booksWithDetails;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2분간 캐시
  });

  return {
    userBooks,
    isLoading,
    error,
    refetch,
  };
}
