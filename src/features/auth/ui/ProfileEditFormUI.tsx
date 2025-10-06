import { useEffect } from 'react';

import type { FieldErrors, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';

import type { UserDocument } from '@/shared/types/user';
import { Icon } from '@/shared/ui/Icon';

import { Button } from '@/shadcn/ui/button';
import { Input } from '@/shadcn/ui/input';
import { Label } from '@/shadcn/ui/label';

import type { ProfileEditFormData } from '../types/profileEditForm';

import styles from './SignupForm.module.scss';

interface ProfileEditFormUIProps {
  currentUser: UserDocument;
  form: UseFormReturn<ProfileEditFormData>;
  errors: FieldErrors<ProfileEditFormData>;
  isValid: boolean;
  isSubmitting: boolean;
  profilePreview: string | null;
  imageError: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onCancel: () => void;
}

export function ProfileEditFormUI({
  currentUser,
  form,
  errors,
  isValid,
  isSubmitting,
  profilePreview,
  imageError,
  onImageChange,
  onSubmit,
  onCancel,
}: ProfileEditFormUIProps) {
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
        <h2>프로필 수정</h2>
        <p>
          <strong>{currentUser.nickname}</strong>님의 정보를 수정해주세요.
        </p>
      </div>

      <div className={styles.profileImage}>
        <div className={styles.imageWrapper}>
          <img src={profilePreview || currentUser.photoURL || '/default-avatar.png'} alt='프로필' />
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
        {/* 아이디 (수정 불가) */}
        <div className={styles.field}>
          <Label htmlFor='userId'>아이디</Label>
          <Input id='userId' value={currentUser.userId} disabled readOnly />
          <p className={styles.success} style={{ fontSize: '12px', color: '#6b7280' }}>
            아이디는 변경할 수 없습니다
          </p>
        </div>

        {/* 닉네임 */}
        <div className={styles.field}>
          <Label htmlFor='nickname'>닉네임</Label>
          <Input id='nickname' {...register('nickname')} placeholder='2-20자 이내' disabled={isSubmitting} />
          {errors.nickname && <p className={styles.error}>{errors.nickname.message}</p>}
        </div>

        {/* 이메일 (수정 불가) */}
        <div className={styles.field}>
          <Label htmlFor='email'>이메일</Label>
          <Input id='email' value={currentUser.email} type='email' disabled readOnly />
          <p className={styles.success} style={{ fontSize: '12px', color: '#6b7280' }}>
            이메일은 변경할 수 없습니다
          </p>
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
          <Button type='submit' disabled={isSubmitting || !isValid}>
            {isSubmitting ? '수정 중...' : '수정완료'}
          </Button>
        </div>
      </form>
    </div>
  );
}
