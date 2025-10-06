'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { useAuth } from '../model/useAuth';
import { useJoinForm } from '../model/useJoinForm';
import { SignupFormUI } from './SignupFormUI';

export function SignupForm() {
  const router = useRouter();
  const { firebaseUser } = useAuth();

  const {
    form,
    errors,
    isValid,
    isSubmitting,
    userIdCheckStatus,
    watchedUserId,
    profilePreview,
    imageError,
    handleUserIdCheck,
    handleImageChange,
    handleSubmit,
    handleCancel,
  } = useJoinForm({
    firebaseUser,
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다!');
      router.push('/profile');
    },
    onCancel: () => {
      router.push('/');
    },
  });

  const handleFormSubmit = async (e?: React.BaseSyntheticEvent) => {
    try {
      await handleSubmit(e);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleFormCancel = async () => {
    try {
      await handleCancel();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('취소 처리에 실패했습니다.');
      }
    }
  };

  if (!firebaseUser) {
    return <div>로그인이 필요합니다.</div>;
  }

  return (
    <SignupFormUI
      firebaseUser={firebaseUser}
      form={form}
      errors={errors}
      isValid={isValid}
      isSubmitting={isSubmitting}
      userIdCheckStatus={userIdCheckStatus}
      watchedUserId={watchedUserId}
      profilePreview={profilePreview}
      imageError={imageError}
      onUserIdCheck={handleUserIdCheck}
      onImageChange={handleImageChange}
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
    />
  );
}
