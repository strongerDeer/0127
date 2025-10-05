'use client';

import { Button } from '@/shadcn/ui/button';

import { LogOut } from 'lucide-react';

import { useAuth } from '../model/useAuth';

/**
 * 로그아웃 버튼 컴포넌트
 */
export function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <Button onClick={signOut} variant='outline' size='sm' className='gap-2'>
      <LogOut className='h-4 w-4' />
      로그아웃
    </Button>
  );
}
