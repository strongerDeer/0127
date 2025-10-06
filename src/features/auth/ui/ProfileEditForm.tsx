'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import type { UserDocument } from '@/shared/types/user';

import { useProfileEdit } from '../model/useProfileEdit';
import { ProfileEditFormUI } from './ProfileEditFormUI';

interface ProfileEditFormProps {
  currentUser: UserDocument;
}

export function ProfileEditForm({ currentUser }: ProfileEditFormProps) {
  const router = useRouter();

  const {
    form,
    errors,
    isValid,
    isSubmitting,
    profilePreview,
    imageError,
    handleImageChange,
    handleSubmit,
    handleCancel,
  } = useProfileEdit({
    currentUser,
    onSuccess: () => {
      toast.success('프로필이 수정되었습니다!');
      router.push('/profile');
    },
    onCancel: () => {
      router.push('/profile');
    },
  });

  const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
    try {
      await handleSubmit(e);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('프로필 수정 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <ProfileEditFormUI
      currentUser={currentUser}
      form={form}
      errors={errors}
      isValid={isValid}
      isSubmitting={isSubmitting}
      profilePreview={profilePreview}
      imageError={imageError}
      onImageChange={handleImageChange}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
    />
  );
}
