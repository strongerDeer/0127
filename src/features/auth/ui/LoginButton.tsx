'use client';

import { Button } from '@/shadcn/ui/button';

import { LogIn } from 'lucide-react';

import { useAuth } from '../model/useAuth';

/**
 * Google 로그인 버튼 컴포넌트
 */
export function LoginButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button onClick={signInWithGoogle} size='lg' className='gap-2'>
      <LogIn className='h-5 w-5' />
      Google로 로그인
    </Button>
  );
}
