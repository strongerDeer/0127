'use client';

import { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { userRepository } from '@/shared/api';
import { uploadProfileImage } from '@/shared/api/firebase/storage/uploadImage';
import { IMAGE_VALIDATION } from '@/shared/constants/imageValidation';
import type { UserDocument } from '@/shared/types/user';

import { type ProfileEditFormData, profileEditFormSchema } from '../types/profileEditForm';

interface UseProfileEditProps {
  currentUser: UserDocument;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useProfileEdit({ currentUser, onSuccess, onCancel }: UseProfileEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const form = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditFormSchema),
    defaultValues: {
      nickname: currentUser.nickname,
      gender: currentUser.gender,
      birth: currentUser.birth || '',
      bio: currentUser.bio || '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  // 프로필 이미지 변경
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 에러 초기화
      setImageError(null);

      // 파일 크기 체크 (5MB)
      if (file.size > IMAGE_VALIDATION.MAX_SIZE) {
        setImageError(IMAGE_VALIDATION.ERRORS.SIZE_EXCEEDED);
        return;
      }

      // 이미지 파일 체크
      if (!file.type.startsWith('image/')) {
        setImageError(IMAGE_VALIDATION.ERRORS.INVALID_TYPE);
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
    async (data: ProfileEditFormData) => {
      setIsSubmitting(true);

      try {
        // 프로필 이미지 업로드 (변경한 경우)
        let photoURL = currentUser.photoURL;
        if (profileImage) {
          photoURL = await uploadProfileImage(profileImage, currentUser.userId);
        }

        // 사용자 정보 업데이트
        await userRepository.update(currentUser.userId, {
          nickname: data.nickname,
          gender: data.gender,
          birth: data.birth,
          bio: data.bio,
          photoURL,
        });

        onSuccess();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('프로필 수정 중 오류가 발생했습니다');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentUser, profileImage, onSuccess]
  );

  // 취소 처리
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

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
    profilePreview,
    imageError,
    handleImageChange,
    handleSubmit: handleSubmit(onSubmit),
    handleCancel,
  };
}
