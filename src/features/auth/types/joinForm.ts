import { FieldValue, Timestamp } from 'firebase/firestore';
import { z } from 'zod';

import type { UserRegistrationData } from '@/entities/user/model/types';

/**
 * 회원가입 폼 스키마
 */
export const joinFormSchema = z.object({
  userId: z
    .string()
    .min(3, '아이디는 3자 이상 입력해주세요')
    .max(20, '아이디는 20자 이하로 입력해주세요')
    .regex(/^[a-zA-Z0-9_-]+$/, '영문, 숫자, _, - 만 사용 가능합니다'),
  nickname: z.string().min(2, '닉네임은 2자 이상 입력해주세요').max(20, '닉네임은 20자 이하로 입력해주세요'),
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birth: z
    .string()
    .regex(/^\d{6}$/, '생년월일은 6자리 숫자로 입력해주세요 (예: 920315)')
    .refine((birth) => {
      if (!birth) return true; // 선택사항이므로 빈 값 허용
      const month = parseInt(birth.substring(2, 4));
      const day = parseInt(birth.substring(4, 6));

      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;

      return true;
    }, '올바른 생년월일을 입력해주세요')
    .optional(),
  bio: z.string().optional(),
});

export type JoinFormData = z.infer<typeof joinFormSchema>;

/**
 * 사용자 생성 데이터 (Firestore 저장용)
 */
export interface CreateUserData extends UserRegistrationData {
  userId: string; // 책장 주소용 ID
  uid: string; // Firebase UID
  email: string;
  photoURL?: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

/**
 * 이메일에서 기본 사용자 ID 추출
 */
export const getDefaultUserId = (email: string): string => {
  return email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
};
