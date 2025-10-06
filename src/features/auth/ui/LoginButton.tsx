'use client';

import { Icon } from '@/shared/ui/Icon';

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
      <Icon name='login' />
      로그인
    </Button>
  );
}
