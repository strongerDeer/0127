'use client';

import { useAuth } from '@/features/auth/model/useAuth';
import { LoginButton } from '@/features/auth/ui/LoginButton';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg text-gray-500'>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 p-8'>
      <h1 className='text-4xl font-bold'>Google 로그인 테스트</h1>

      {user ? (
        <div className='flex flex-col items-center gap-4'>
          {user.photoURL && <img src={user.photoURL} alt='프로필' className='h-20 w-20 rounded-full' />}
          <div className='text-center'>
            <p className='text-xl font-semibold'>{user.displayName}</p>
            <p className='text-sm text-gray-500'>{user.email}</p>
          </div>
          <LogoutButton />
        </div>
      ) : (
        <div className='flex flex-col items-center gap-4'>
          <p className='text-gray-600'>로그인이 필요합니다</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
}
