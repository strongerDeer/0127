'use client';

import { isFirebaseConnected } from '@/shared/api/firebase/config';

export default function Home() {
  const isConnected = isFirebaseConnected();

  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-8'>
      <h1 className='text-4xl font-bold'>Firebase 연결 테스트</h1>

      <div className={`rounded-lg p-6 ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        <p className='text-xl font-semibold'>{isConnected ? '✅ Firebase 연결 성공!' : '❌ Firebase 연결 실패'}</p>
      </div>

      <div className='mt-4 text-sm text-gray-600'>
        <p>환경 변수가 올바르게 설정되었는지 확인하세요.</p>
      </div>
    </div>
  );
}
