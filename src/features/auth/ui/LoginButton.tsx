'use client';

import { LogIn } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

import { useAuth } from '../model/useAuth';

import styles from './LoginButton.module.scss';

/**
 * Google 로그인 버튼 컴포넌트
 */
export function LoginButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button onClick={signInWithGoogle} size='lg' className={styles.button}>
      <LogIn />
      Google로 로그인
    </Button>
  );
}
