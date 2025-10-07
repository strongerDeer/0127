import { z } from 'zod';

import type { BookRating } from '@/shared/types/book';

/**
 * 책 등록 폼 스키마
 */
export const bookRegisterFormSchema = z.object({
  // 읽기 정보
  status: z.enum(['reading', 'completed']), // 읽기 상태
  startDate: z.string().optional(), // 시작일 (YYYY-MM-DD)
  endDate: z.string().optional(), // 완독일 (YYYY-MM-DD)

  // 평가
  rating: z.number().min(0).max(10), // 0, 1-5, 10
  review: z.string().max(100, '한줄평은 100자 이내로 작성해주세요').optional(), // 한줄평 (공개)
  memo: z.string().optional(), // 메모 (비공개)
  tags: z.array(z.string()).max(10, '태그는 최대 10개까지 가능합니다').optional(), // 태그

  // 공개 설정
  isPublic: z.boolean(), // 공개/비공개
});

export type BookRegisterFormData = z.infer<typeof bookRegisterFormSchema>;

/**
 * 평점 옵션
 */
export const RATING_OPTIONS: { value: BookRating; label: string; emoji?: string }[] = [
  { value: 0, label: '미평가' },
  { value: 1, label: '별로예요', emoji: '😞' },
  { value: 2, label: '그저 그래요', emoji: '😐' },
  { value: 3, label: '괜찮아요', emoji: '🙂' },
  { value: 4, label: '좋아요', emoji: '😊' },
  { value: 5, label: '최고예요', emoji: '😍' },
  { value: 10, label: '인생책', emoji: '✨' },
];
