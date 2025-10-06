'use client';

import { UserProfile } from '@/widgets/profile/UserProfile';

import { useAuth } from '@/features/auth/model/useAuth';

import styles from './page.module.scss';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <UserProfile userId={user.userId} currentUserId={user.userId} />
    </div>
  );
}
