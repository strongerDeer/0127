'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/features/auth/model/useAuth';

// 로그인하지 않은 사용자를 위한 페이지
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isNewUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // 신규 사용자는 회원가입 페이지로
    if (isNewUser && !window.location.pathname.includes('/signup')) {
      router.push('/signup');
      return;
    }

    // 기존 사용자는 프로필 페이지로
    if (user && !isNewUser) {
      router.push('/profile');
    }
  }, [user, isNewUser, loading, router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
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
