'use client';

import { useRouter } from 'next/navigation';

import { BookSearchForm } from '@/features/book-search/ui/BookSearchForm';

import type { AladinBook } from '@/shared/types/aladin';

import styles from './page.module.scss';

export default function SearchPage() {
  const router = useRouter();

  const handleSelectBook = (book: AladinBook) => {
    // ISBN으로 책 등록 페이지로 이동
    router.push(`/books/register?isbn=${book.isbn13}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>도서 검색</h1>
        <p>읽은 책을 검색하고 등록하세요</p>
      </div>

      <div className={styles.searchWrapper}>
        <BookSearchForm onSelectBook={handleSelectBook} />
      </div>
    </div>
  );
}
