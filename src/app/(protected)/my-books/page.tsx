'use client';

import Link from 'next/link';

import { useAuth } from '@/features/auth/model/useAuth';
import { useMyBooks } from '@/features/book-list/model/useMyBooks';
import { BookCard } from '@/features/book-list/ui/BookCard';

import { Icon } from '@/shared/ui/Icon';

import { Button } from '@/shadcn/ui/button';

import styles from './page.module.scss';

export default function MyBooksPage() {
  const { user } = useAuth();
  const { userBooks, isLoading, error } = useMyBooks(user?.userId || '');

  if (isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>책 목록을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>책 목록을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>내 서재</h1>
          <p className={styles.count}>총 {userBooks.length}권</p>
        </div>
        <Link href='/search'>
          <Button>
            <Icon name='plus' size={20} />책 추가
          </Button>
        </Link>
      </div>

      {userBooks.length === 0 ? (
        <div className={styles.empty}>
          <Icon name='search' size={48} className={styles.emptyIcon} />
          <h2>아직 등록된 책이 없습니다</h2>
          <p>읽은 책을 검색하고 등록해보세요</p>
          <Link href='/search'>
            <Button size='lg' className={styles.emptyButton}>
              <Icon name='plus' size={20} />책 검색하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className={styles.bookList}>
          {userBooks.map((userBook) => (
            <BookCard key={userBook.id} userBook={userBook} />
          ))}
        </div>
      )}
    </div>
  );
}
