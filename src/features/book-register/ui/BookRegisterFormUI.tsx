import type { FieldErrors, UseFormReturn } from 'react-hook-form';

import type { AladinBook } from '@/shared/types/aladin';

import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';
import { Textarea } from '@/shadcn/ui/textarea';

import { type BookRegisterFormData, RATING_OPTIONS } from '../types/bookRegisterForm';

import styles from './BookRegisterForm.module.scss';

interface BookRegisterFormUIProps {
  book: AladinBook;
  form: UseFormReturn<BookRegisterFormData>;
  errors: FieldErrors<BookRegisterFormData>;
  isValid: boolean;
  isSubmitting: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
}

export function BookRegisterFormUI({
  book,
  form,
  errors,
  isValid,
  isSubmitting,
  onSubmit,
  onCancel,
}: BookRegisterFormUIProps) {
  const { register, watch } = form;

  const watchedRating = watch('rating');
  const watchedStatus = watch('status');

  return (
    <div className={styles.container}>
      {/* 책 정보 */}
      <div className={styles.bookInfo}>
        <img src={book.cover} alt={book.title} className={styles.bookCover} />
        <div className={styles.bookDetails}>
          <h2 className={styles.bookTitle}>{book.title}</h2>
          <p className={styles.bookAuthor}>{book.author}</p>
          <p className={styles.bookPublisher}>
            {book.publisher} · {book.pubDate}
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        {/* 읽기 상태 */}
        <div className={styles.field}>
          <Label>읽기 상태</Label>
          <div className={styles.statusButtons}>
            <label className={styles.statusButton}>
              <input type='radio' {...register('status')} value='reading' disabled={isSubmitting} />
              <span>읽는 중</span>
            </label>
            <label className={styles.statusButton}>
              <input type='radio' {...register('status')} value='completed' disabled={isSubmitting} />
              <span>완독</span>
            </label>
          </div>
          {errors.status && <p className={styles.error}>{errors.status.message}</p>}
        </div>

        {/* 시작일 */}
        <div className={styles.field}>
          <Label htmlFor='startDate'>시작일 (선택)</Label>
          <Input id='startDate' type='date' {...register('startDate')} disabled={isSubmitting} />
          {errors.startDate && <p className={styles.error}>{errors.startDate.message}</p>}
        </div>

        {/* 완독일 */}
        {watchedStatus === 'completed' && (
          <div className={styles.field}>
            <Label htmlFor='endDate'>완독일</Label>
            <Input id='endDate' type='date' {...register('endDate')} disabled={isSubmitting} />
            {errors.endDate && <p className={styles.error}>{errors.endDate.message}</p>}
          </div>
        )}

        {/* 별점 */}
        <div className={styles.field}>
          <Label>별점</Label>
          <div className={styles.ratingButtons}>
            {RATING_OPTIONS.map((option) => (
              <label key={option.value} className={styles.ratingButton}>
                <input
                  type='radio'
                  {...register('rating', { valueAsNumber: true })}
                  value={option.value}
                  disabled={isSubmitting}
                />
                <span className={watchedRating === option.value ? styles.active : ''}>
                  {option.emoji && <span className={styles.emoji}>{option.emoji}</span>}
                  <span className={styles.ratingLabel}>{option.label}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.rating && <p className={styles.error}>{errors.rating.message}</p>}
        </div>

        {/* 한줄평 */}
        <div className={styles.field}>
          <Label htmlFor='review'>한줄평 (공개, 100자 이내)</Label>
          <Input
            id='review'
            {...register('review')}
            placeholder='이 책에 대한 한줄평을 남겨주세요'
            maxLength={100}
            disabled={isSubmitting}
          />
          {errors.review && <p className={styles.error}>{errors.review.message}</p>}
        </div>

        {/* 메모 */}
        <div className={styles.field}>
          <Label htmlFor='memo'>나만의 메모 (비공개)</Label>
          <Textarea
            id='memo'
            {...register('memo')}
            placeholder='나만 볼 수 있는 메모를 남겨주세요'
            disabled={isSubmitting}
            rows={4}
          />
          {errors.memo && <p className={styles.error}>{errors.memo.message}</p>}
        </div>

        {/* 태그 */}
        <div className={styles.field}>
          <Label htmlFor='tags'>태그 (쉼표로 구분, 최대 10개)</Label>
          <Input id='tags' {...register('tags')} placeholder='예: 판타지, 추천도서, 재밌음' disabled={isSubmitting} />
          <p className={styles.hint}>쉼표(,)로 구분하여 입력해주세요</p>
          {errors.tags && <p className={styles.error}>{errors.tags.message}</p>}
        </div>

        {/* 공개 설정 */}
        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input type='checkbox' {...register('isPublic')} disabled={isSubmitting} />
            <span>이 책을 공개합니다</span>
          </label>
          {errors.isPublic && <p className={styles.error}>{errors.isPublic.message}</p>}
        </div>

        {/* 버튼 */}
        <div className={styles.buttons}>
          <Button type='button' onClick={onCancel} variant='outline' disabled={isSubmitting}>
            취소
          </Button>
          <Button type='submit' disabled={isSubmitting || !isValid}>
            {isSubmitting ? '등록 중...' : '책장 등록'}
          </Button>
        </div>
      </form>
    </div>
  );
}
