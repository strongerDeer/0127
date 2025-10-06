import { useEffect, useState } from 'react';

import { type User as FirebaseUser, deleteUser, signOut as firebaseSignOut, signInWithPopup } from 'firebase/auth';

import type { User } from '@/entities/user/model/types';

import { userRepository } from '@/shared/api';
import { firebaseAuth, googleAuthProvider } from '@/shared/api/firebase/config';

/**
 * 인증 관련 비즈니스 로직
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // 사용자 상태 변경 감지
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setFirebaseUser(authUser);

        // Firestore에서 사용자 문서 확인
        const userDoc = await userRepository.getByUid(authUser.uid);

        if (userDoc) {
          // 기존 사용자
          setUser({
            uid: authUser.uid,
            email: authUser.email,
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
          });
          setIsNewUser(false);
        } else {
          // 신규 사용자 - 회원가입 필요
          setUser(null);
          setIsNewUser(true);
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
        setIsNewUser(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인
  const signInWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, googleAuthProvider);
  };

  // 로그아웃
  const signOut = async () => {
    await firebaseSignOut(firebaseAuth);
  };

  // 회원가입 취소 (Firebase 사용자 삭제)
  const cancelRegistration = async () => {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (!currentUser) {
        throw new Error('삭제할 사용자가 없습니다.');
      }
      await deleteUser(currentUser);
    } catch {
      throw new Error('회원가입 취소에 실패했습니다.');
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    isNewUser,
    signInWithGoogle,
    signOut,
    cancelRegistration,
  };
}
