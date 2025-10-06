'use client';

import { UserProfile } from '@/widgets/profile/UserProfile';

import { useAuth } from '@/features/auth/model/useAuth';

import styles from './page.module.scss';

/**
 * 프로필 페이지
 */
export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>로그인이 필요합니다.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <UserProfile userId={user.userId} currentUserId={user.userId} />
    </div>
  );
}
