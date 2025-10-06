'use client';

import { useEffect, useState } from 'react';

import { LogoutButton } from '@/features/auth/ui/LogoutButton';

import { userRepository } from '@/shared/api';
import type { UserDocument } from '@/shared/types/user';

import { UserProfileCard } from './ui/UserProfileCard';

import styles from './UserProfile.module.scss';

interface UserProfileProps {
  userId: string;
  currentUserId?: string;
}

/**
 * 사용자 프로필 위젯
 */
export function UserProfile({ userId, currentUserId }: UserProfileProps) {
  const [user, setUser] = useState<UserDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const userData = await userRepository.getById(userId);
        if (!userData) {
          setError('사용자를 찾을 수 없습니다.');
          return;
        }
        setUser(userData);
        setError(null);
      } catch {
        setError('프로필을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId]);

  const handleEditClick = () => {
    // TODO: 프로필 수정 페이지로 이동
    alert('프로필 수정 기능은 곧 제공됩니다.');
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error || !user) {
    return <div className={styles.error}>{error || '사용자를 찾을 수 없습니다.'}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>{isOwnProfile && <LogoutButton />}</div>
      <UserProfileCard
        user={user}
        isOwnProfile={isOwnProfile}
        onEditClick={isOwnProfile ? handleEditClick : undefined}
      />
    </div>
  );
}
