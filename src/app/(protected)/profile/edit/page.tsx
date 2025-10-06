'use client';

import { useAuth } from '@/features/auth/model/useAuth';
import { ProfileEditForm } from '@/features/auth/ui/ProfileEditForm';

import styles from '../page.module.scss';

export default function ProfileEditPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <ProfileEditForm currentUser={user} />
    </div>
  );
}
