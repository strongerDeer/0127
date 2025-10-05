'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@/shadcn/ui/button';

import { useAuth } from '../model/useAuth';

import styles from './LogoutButton.module.scss';

/**
 * 로그아웃 버튼 컴포넌트
 */
export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button onClick={signOut} variant='outline' size='sm' className={styles.button}>
      <LogOut />
      로그아웃
    </Button>
  );
}
