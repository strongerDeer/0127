'use client';

import { useCallback, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Timestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';

import { bookRepository, userBookRepository } from '@/shared/api';
import type { AladinBook } from '@/shared/types/aladin';

import { type BookRegisterFormData, bookRegisterFormSchema } from '../types/bookRegisterForm';

interface UseBookRegisterProps {
  book: AladinBook;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useBookRegister({ book, userId, onSuccess, onCancel }: UseBookRegisterProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookRegisterFormData>({
    resolver: zodResolver(bookRegisterFormSchema),
    defaultValues: {
      status: 'reading',
      rating: 0,
      isPublic: true, // 기본값: 공개
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // 폼 제출
  const onSubmit = useCallback(
    async (data: BookRegisterFormData) => {
      setIsSubmitting(true);

      try {
        // 1. books 컬렉션에 책 정보 저장 (없으면 생성)
        const bookExists = await bookRepository.exists(book.isbn13);
        if (!bookExists) {
          await bookRepository.create({
            isbn: book.isbn13,
            isbn13: book.isbn13,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            pubDate: book.pubDate,
            description: book.description,
            cover: book.cover,
            categoryName: book.categoryName,
            priceStandard: book.priceStandard,
          });
        }

        // 2. 중복 체크
        const isDuplicate = await userBookRepository.checkDuplicate(userId, book.isbn13);
        if (isDuplicate) {
          throw new Error('이미 등록된 책입니다.');
        }

        // 3. 태그 처리 (쉼표로 분리)
        let tags: string[] = [];
        if (data.tags && Array.isArray(data.tags)) {
          tags = data.tags;
        } else if (data.tags && typeof data.tags === 'string') {
          tags = data.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0);
        }

        // 4. 날짜 변환
        const startDate = data.startDate ? Timestamp.fromDate(new Date(data.startDate)) : undefined;
        const endDate = data.endDate ? Timestamp.fromDate(new Date(data.endDate)) : undefined;

        // 5. userBooks 컬렉션에 저장
        await userBookRepository.create({
          userId,
          isbn: book.isbn13,
          status: data.status,
          isPublic: data.isPublic,
          rating: data.rating,
          review: data.review,
          memo: data.memo,
          tags,
          startDate,
          endDate,
        });

        onSuccess();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('책 등록 중 오류가 발생했습니다');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [book, userId, onSuccess]
  );

  // 취소 처리
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return {
    form,
    errors,
    isValid,
    isSubmitting,
    handleSubmit: handleSubmit(onSubmit),
    handleCancel,
  };
}
