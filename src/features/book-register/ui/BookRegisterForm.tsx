'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import type { AladinBook } from '@/shared/types/aladin';

import { useBookRegister } from '../model/useBookRegister';
import { BookRegisterFormUI } from './BookRegisterFormUI';

interface BookRegisterFormProps {
  book: AladinBook;
  userId: string;
}

/**
 * 책 등록 Container 컴포넌트
 */
export function BookRegisterForm({ book, userId }: BookRegisterFormProps) {
  const router = useRouter();

  const { form, errors, isValid, isSubmitting, handleSubmit, handleCancel } = useBookRegister({
    book,
    userId,
    onSuccess: () => {
      toast.success('책이 등록되었습니다!');
      router.push('/my-books');
    },
    onCancel: () => {
      router.back();
    },
  });

  const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
    try {
      await handleSubmit(e);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('책 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <BookRegisterFormUI
      book={book}
      form={form}
      errors={errors}
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
    />
  );
}
