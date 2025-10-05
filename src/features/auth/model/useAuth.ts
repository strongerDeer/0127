import { useEffect, useState } from 'react';

import { signOut as firebaseSignOut, signInWithPopup } from 'firebase/auth';

import type { User } from '@/entities/user/model/types';

import { firebaseAuth, googleAuthProvider } from '@/shared/api/firebase/config';

/**
 * 인증 관련 비즈니스 로직
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 사용자 상태 변경 감지
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider);
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
}
