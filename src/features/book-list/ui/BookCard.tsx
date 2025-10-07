import Link from 'next/link';

import { RATING_OPTIONS } from '@/features/book-register/types/bookRegisterForm';

import type { UserBookWithBook } from '@/shared/types/book';

import styles from './BookCard.module.scss';

interface BookCardProps {
  userBook: UserBookWithBook;
}

export function BookCard({ userBook }: BookCardProps) {
  const { book, status, rating, review, endDate, isPublic } = userBook;

  // 별점 라벨 찾기
  const ratingOption = RATING_OPTIONS.find((option) => option.value === rating);

  // 완독일 포맷팅
  const formattedEndDate = endDate
    ? new Date(endDate.seconds * 1000).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <Link href={`/books/${book.isbn}`} className={styles.card}>
      <div className={styles.coverWrapper}>
        <img src={book.cover} alt={book.title} className={styles.cover} />
        {!isPublic && <span className={styles.privateBadge}>비공개</span>}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>{book.author}</p>

        <div className={styles.meta}>
          <span className={styles.status}>{status === 'reading' ? '읽는 중' : '완독'}</span>
          {formattedEndDate && <span className={styles.date}>{formattedEndDate}</span>}
        </div>

        {rating > 0 && (
          <div className={styles.rating}>
            {ratingOption?.emoji && <span className={styles.emoji}>{ratingOption.emoji}</span>}
            <span className={styles.ratingLabel}>{ratingOption?.label}</span>
          </div>
        )}

        {review && <p className={styles.review}>{review}</p>}
      </div>
    </Link>
  );
}
