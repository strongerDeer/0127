import { useEffect } from 'react';

import type { User as FirebaseUser } from 'firebase/auth';
import type { FieldErrors, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import { Icon } from '@/shared/ui/Icon';

import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

import type { JoinFormData } from '../types/joinForm';

import styles from './SignupForm.module.scss';

interface SignupFormUIProps {
  firebaseUser: FirebaseUser | null;
  form: UseFormReturn<JoinFormData>;
  errors: FieldErrors<JoinFormData>;
  isValid: boolean;
  isSubmitting: boolean;
  userIdCheckStatus: 'idle' | 'checking' | 'available' | 'taken';
  watchedUserId: string;
  profilePreview: string | null;
  imageError: string | null;
  onUserIdCheck: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
}

export function SignupFormUI({
  firebaseUser,
  form,
  errors,
  isValid,
  isSubmitting,
  userIdCheckStatus,
  watchedUserId,
  profilePreview,
  imageError,
  onUserIdCheck,
  onImageChange,
  onSubmit,
  onCancel,
}: SignupFormUIProps) {
  const { register } = form;

  // 이미지 에러 처리
  useEffect(() => {
    if (imageError) {
      toast.error(imageError);
    }
  }, [imageError]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>안녕하세요 :)</h2>
        <p>
          <strong>당신의 표지</strong>를 작성해주세요.
        </p>
      </div>

      <div className={styles.profileImage}>
        <div className={styles.imageWrapper}>
          <img src={profilePreview || firebaseUser?.photoURL || '/default-avatar.png'} alt='프로필' />
          <label htmlFor='profileImageInput' className={styles.imgButton}>
            <Icon name='image' size={20} />
            <input
              id='profileImageInput'
              type='file'
              accept='image/*'
              onChange={onImageChange}
              disabled={isSubmitting}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        {/* 아이디 */}
        <div className={styles.field}>
          <Label htmlFor='userId'>아이디</Label>
          <div className={styles.userIdField}>
            <Input
              id='userId'
              {...register('userId')}
              placeholder='3자 이상 (영문, 숫자, _, - 사용 가능)'
              disabled={isSubmitting}
            />
            <Button
              type='button'
              onClick={onUserIdCheck}
              disabled={isSubmitting || !watchedUserId || watchedUserId.length < 3}
              variant='outline'
            >
              {userIdCheckStatus === 'checking' ? '확인 중...' : '중복 확인'}
            </Button>
          </div>
          {userIdCheckStatus === 'available' && <p className={styles.success}>사용 가능한 아이디입니다</p>}
          {userIdCheckStatus === 'taken' && <p className={styles.error}>이미 사용 중인 아이디입니다</p>}
          {errors.userId && userIdCheckStatus !== 'taken' && <p className={styles.error}>{errors.userId.message}</p>}
        </div>

        {/* 닉네임 */}
        <div className={styles.field}>
          <Label htmlFor='nickname'>닉네임</Label>
          <Input id='nickname' {...register('nickname')} placeholder='2-20자 이내' disabled={isSubmitting} />
          {errors.nickname && <p className={styles.error}>{errors.nickname.message}</p>}
        </div>

        {/* 이메일 */}
        <div className={styles.field}>
          <Label htmlFor='email'>이메일</Label>
          <Input id='email' {...register('email')} type='email' disabled readOnly />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}
        </div>

        {/* 성별 (선택) */}
        <div className={styles.field}>
          <Label>성별 (선택)</Label>
          <div className={styles.genderButtons}>
            <label className={styles.genderButton}>
              <input type='radio' {...register('gender')} value='male' disabled={isSubmitting} />
              <span>남성</span>
            </label>
            <label className={styles.genderButton}>
              <input type='radio' {...register('gender')} value='female' disabled={isSubmitting} />
              <span>여성</span>
            </label>
            <label className={styles.genderButton}>
              <input type='radio' {...register('gender')} value='other' disabled={isSubmitting} />
              <span>기타</span>
            </label>
          </div>
          {errors.gender && <p className={styles.error}>{errors.gender.message}</p>}
        </div>

        {/* 생년월일 (선택) */}
        <div className={styles.field}>
          <Label htmlFor='birth'>생년월일 (선택)</Label>
          <Input
            id='birth'
            {...register('birth')}
            placeholder='6자리 (예: 920315)'
            maxLength={6}
            disabled={isSubmitting}
          />
          {errors.birth && <p className={styles.error}>{errors.birth.message}</p>}
        </div>

        {/* 소개 (선택) */}
        <div className={styles.field}>
          <Label htmlFor='bio'>소개 (선택)</Label>
          <Input id='bio' {...register('bio')} placeholder='간단한 자기소개를 입력해주세요' disabled={isSubmitting} />
          {errors.bio && <p className={styles.error}>{errors.bio.message}</p>}
        </div>

        {/* 버튼 */}
        <div className={styles.buttons}>
          <Button type='button' onClick={onCancel} variant='outline' disabled={isSubmitting}>
            취소
          </Button>
          <Button type='submit' disabled={isSubmitting || !isValid || userIdCheckStatus !== 'available'}>
            {isSubmitting ? '가입 중...' : '가입완료'}
          </Button>
        </div>
      </form>
    </div>
  );
}
