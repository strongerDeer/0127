'use client';

import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

import { Icon } from '@/shared/ui/Icon';

import { Button } from '@/shadcn/ui/button';

import { useAuth } from '../model/useAuth';

import styles from './LogoutButton.module.scss';

/**
 * 로그아웃 버튼 컴포넌트
 */
export function LogoutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch {
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  return (
    <Button onClick={handleLogout} variant='outline' size='sm' className={styles.button}>
      <Icon name='logout' />
      로그아웃
    </Button>
  );
}
