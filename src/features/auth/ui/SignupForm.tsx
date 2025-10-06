'use client';

import { useRouter } from 'next/navigation';

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
    handleUserIdCheck,
    handleSubmit,
    handleCancel,
  } = useJoinForm({
    firebaseUser,
    onSuccess: () => {
      alert('회원가입이 완료되었습니다!');
      router.push('/');
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
        alert(error.message);
      } else {
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
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
      onUserIdCheck={handleUserIdCheck}
      onSubmit={handleFormSubmit}
      onCancel={handleCancel}
    />
  );
}
