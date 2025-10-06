'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/model/useAuth';

import styles from './layout.module.scss';

/**
 * Public Layout
 * 로그인하지 않은 사용자를 위한 페이지들 (login, signup)
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isNewUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // 신규 사용자는 회원가입 페이지로
    if (isNewUser && !pathname?.includes('/signup')) {
      router.push('/signup');
      return;
    }

    // 기존 사용자는 프로필 페이지로
    if (user && !isNewUser) {
      router.push('/profile');
    }
  }, [user, isNewUser, loading, pathname, router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>로딩 중...</p>
      </div>
    );
  }

  // 기존 사용자는 리다이렉트 중
  if (user && !isNewUser) {
    return null;
  }

  return <>{children}</>;
}
