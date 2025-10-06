'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Icon } from '@/shared/ui/Icon';

import { Button } from '@/shadcn/ui/button';

import { useAuth } from '../model/useAuth';

import styles from './LoginButton.module.scss';

/**
 * Google 로그인 버튼 컴포넌트
 */
export function LoginButton() {
  const router = useRouter();
  const { user, isNewUser, loading, signInWithGoogle } = useAuth();

  // 로그인 상태 변경 시 리다이렉트
  useEffect(() => {
    if (loading) return;

    if (isNewUser) {
      // 신규 사용자 -> 회원가입 페이지
      router.push('/signup');
    } else if (user) {
      // 기존 사용자 -> 메인 페이지 (TODO: 나중에 대시보드로 변경)
      router.push('/');
    }
  }, [user, isNewUser, loading, router]);

  return (
    <Button onClick={signInWithGoogle} size='lg' className={styles.button}>
      <Icon name='login' />
      로그인
    </Button>
  );
}
