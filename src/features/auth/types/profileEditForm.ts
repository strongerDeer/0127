import { z } from 'zod';

/**
 * 프로필 수정 폼 스키마
 */
export const profileEditFormSchema = z.object({
  nickname: z.string().min(2, '닉네임은 2자 이상 입력해주세요').max(20, '닉네임은 20자 이하로 입력해주세요'),
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

export type ProfileEditFormData = z.infer<typeof profileEditFormSchema>;
