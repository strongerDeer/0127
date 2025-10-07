import type { AladinBook } from '@/shared/types/aladin';
import { Icon } from '@/shared/ui/Icon';

import { Input } from '@/shadcn/ui/input';

import styles from './BookSearchForm.module.scss';

interface BookSearchFormUIProps {
  query: string;
  books: AladinBook[];
  isLoading: boolean;
  error: Error | null;
  onQueryChange: (value: string) => void;
  onSelectBook: (book: AladinBook) => void;
}

export function BookSearchFormUI({
  query,
  books,
  isLoading,
  error,
  onQueryChange,
  onSelectBook,
}: BookSearchFormUIProps) {
  return (
    <div className={styles.container}>
      {/* 검색 입력 */}
      <div className={styles.searchBox}>
        <Icon name='search' className={styles.searchIcon} />
        <Input
          type='text'
          placeholder='책 제목, 저자, ISBN으로 검색'
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* 검색 결과 */}
      {query.length >= 2 && (
        <div className={styles.results}>
          {isLoading && <p className={styles.message}>검색 중...</p>}

          {error && <p className={styles.error}>검색 중 오류가 발생했습니다.</p>}

          {!isLoading && !error && books.length === 0 && <p className={styles.message}>검색 결과가 없습니다.</p>}

          {!isLoading && !error && books.length > 0 && (
            <ul className={styles.bookList}>
              {books.map((book) => (
                <li key={book.isbn13} className={styles.bookItem} onClick={() => onSelectBook(book)}>
                  <img src={book.cover} alt={book.title} className={styles.bookCover} />
                  <div className={styles.bookInfo}>
                    <h3 className={styles.bookTitle}>{book.title}</h3>
                    <p className={styles.bookAuthor}>{book.author}</p>
                    <p className={styles.bookPublisher}>
                      {book.publisher} · {book.pubDate}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
