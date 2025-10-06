'use client';

import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import type { User as FirebaseUser } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';

import { uploadProfileImage } from '@/shared/api/firebase/storage/uploadImage';
import { IMAGE_VALIDATION } from '@/shared/constants/imageValidation';

import { UserApiError, checkUserIdAvailable, createUser } from '../api/userApi';
import { type JoinFormData, getDefaultUserId, joinFormSchema } from '../types/joinForm';
import { useAuth } from './useAuth';

interface UseJoinFormProps {
  firebaseUser: FirebaseUser | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useJoinForm({ firebaseUser, onSuccess, onCancel }: UseJoinFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIdCheckStatus, setUserIdCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const { cancelRegistration } = useAuth();

  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      userId: '',
      nickname: '',
      email: '',
      gender: undefined,
      birth: '',
      bio: '',
    },
    mode: 'onChange',
  });

  const {
    watch,
    setError,
    clearErrors,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = form;

  const watchedUserId = watch('userId');

  // 사용자 ID 중복 체크 함수
  const handleUserIdCheck = useCallback(
    async (userId?: string) => {
      const targetUserId = userId || watchedUserId;

      if (!targetUserId || targetUserId.length < 3) {
        setError('userId', { message: '아이디는 3자 이상 입력해주세요' });
        setUserIdCheckStatus('idle');
        return;
      }

      setUserIdCheckStatus('checking');

      try {
        const isAvailable = await checkUserIdAvailable(targetUserId);
        if (isAvailable) {
          setUserIdCheckStatus('available');
          clearErrors('userId');
        } else {
          setUserIdCheckStatus('taken');
          setError('userId', { message: '이미 사용 중인 아이디입니다' });
        }
      } catch (error) {
        setUserIdCheckStatus('idle');

        if (error instanceof UserApiError) {
          setError('userId', { message: error.message });
        } else {
          setError('userId', { message: '중복 확인에 실패했습니다' });
        }
      }
    },
    [watchedUserId, setError, clearErrors]
  );

  // 수동 중복 확인 (버튼 클릭)
  const handleManualUserIdCheck = useCallback(() => {
    handleUserIdCheck();
  }, [handleUserIdCheck]);

  // 프로필 이미지 변경
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 파일 크기 체크 (5MB)
      if (file.size > IMAGE_VALIDATION.MAX_SIZE) {
        alert(IMAGE_VALIDATION.ERRORS.SIZE_EXCEEDED);
        return;
      }

      // 이미지 파일 체크
      if (!file.type.startsWith('image/')) {
        alert(IMAGE_VALIDATION.ERRORS.INVALID_TYPE);
        return;
      }

      // 이전 미리보기 URL 해제
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }

      // 파일 저장 및 미리보기 생성
      setProfileImage(file);
      setProfilePreview(URL.createObjectURL(file));
    },
    [profilePreview]
  );

  // 폼 제출
  const onSubmit = useCallback(
    async (data: JoinFormData) => {
      if (!firebaseUser) {
        throw new Error('로그인 정보가 없습니다');
      }

      if (userIdCheckStatus !== 'available') {
        throw new Error('아이디 중복 확인을 완료해주세요');
      }

      setIsSubmitting(true);

      try {
        // 프로필 이미지 업로드 (선택한 경우)
        let photoURL = firebaseUser.photoURL || undefined;
        if (profileImage) {
          photoURL = await uploadProfileImage(profileImage, data.userId);
        }

        await createUser(firebaseUser.uid, {
          userId: data.userId,
          uid: firebaseUser.uid,
          nickname: data.nickname,
          email: data.email,
          gender: data.gender,
          birth: data.birth,
          bio: data.bio,
          photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        onSuccess();
      } catch (error) {
        if (error instanceof UserApiError) {
          throw new Error(error.message);
        } else {
          throw new Error('회원가입 중 오류가 발생했습니다');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [firebaseUser, userIdCheckStatus, profileImage, onSuccess]
  );

  // 회원가입 취소
  const handleCancel = useCallback(async () => {
    try {
      setIsSubmitting(true);

      const confirmed = window.confirm('회원가입을 취소하시겠습니까?\n로그인 정보도 함께 삭제됩니다.');

      if (confirmed) {
        await cancelRegistration();
        onCancel();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '취소 처리에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [cancelRegistration, onCancel]);

  // Firebase 사용자 정보로 초기값 설정
  useEffect(() => {
    if (firebaseUser && !initialCheckDone) {
      const defaultUserId = firebaseUser.email ? getDefaultUserId(firebaseUser.email) : '';

      setValue('userId', defaultUserId);
      setValue('nickname', firebaseUser.displayName || '');
      setValue('email', firebaseUser.email || '');

      if (defaultUserId) {
        handleUserIdCheck(defaultUserId);
      }

      setInitialCheckDone(true);
    }
  }, [firebaseUser, initialCheckDone, setValue, handleUserIdCheck]);

  // 아이디가 변경되면 중복 확인 상태 초기화
  useEffect(() => {
    if (initialCheckDone && watchedUserId) {
      setUserIdCheckStatus('idle');
    }
  }, [watchedUserId, initialCheckDone]);

  // 컴포넌트 언마운트 시 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (profilePreview) {
        URL.revokeObjectURL(profilePreview);
      }
    };
  }, [profilePreview]);

  return {
    form,
    errors,
    isValid,
    isSubmitting,
    userIdCheckStatus,
    watchedUserId,
    profilePreview,
    handleUserIdCheck: handleManualUserIdCheck,
    handleImageChange,
    handleSubmit: handleSubmit(onSubmit),
    handleCancel,
  };
}
