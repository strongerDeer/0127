'use client';

import { useEffect, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { toast } from 'sonner';

import { useAuth } from '@/features/auth/model/useAuth';
import { BookRegisterForm } from '@/features/book-register/ui/BookRegisterForm';

import { getBookByIsbn } from '@/shared/api/aladin/aladinApi';
import type { AladinBook } from '@/shared/types/aladin';

import styles from './page.module.scss';

export default function BookRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [book, setBook] = useState<AladinBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isbn = searchParams.get('isbn');

    if (!isbn) {
      toast.error('책 정보가 없습니다.');
      router.push('/search');
      return;
    }

    async function fetchBook() {
      try {
        setLoading(true);
        const bookData = await getBookByIsbn(isbn);

        if (!bookData) {
          toast.error('책을 찾을 수 없습니다.');
          router.push('/search');
          return;
        }

        setBook(bookData);
      } catch {
        toast.error('책 정보를 불러오는 중 오류가 발생했습니다.');
        router.push('/search');
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>책 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!user || !book) {
    return null;
  }

  return (
    <div className={styles.container}>
      <BookRegisterForm book={book} userId={user.userId} />
    </div>
  );
}
