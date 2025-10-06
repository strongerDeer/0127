import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import type { UserDocument } from '@/shared/types/user';

import { firebaseFirestore } from '../config';

/**
 * Firebase User Repository
 */
export class FirebaseUserRepository {
  private readonly collectionName = 'users';

  /**
   * 새 사용자 생성 (회원가입)
   */
  async create(userId: string, userData: Partial<UserDocument>): Promise<void> {
    try {
      const userRef = doc(firebaseFirestore, this.collectionName, userId);
      const now = serverTimestamp();

      const userDoc: UserDocument = {
        userId,
        uid: userData.uid || '',
        nickname: userData.nickname || '사용자',
        email: userData.email || '',
        photoURL: userData.photoURL,
        bio: userData.bio,
        birth: userData.birth,
        gender: userData.gender,
        libraryVisibility: userData.libraryVisibility || 'public', // 기본값: 전체공개
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(userRef, userDoc);
    } catch {
      throw new Error('사용자 생성에 실패했습니다.');
    }
  }

  /**
   * Firebase UID로 사용자 조회
   */
  async getByUid(uid: string): Promise<UserDocument | null> {
    try {
      const usersRef = collection(firebaseFirestore, this.collectionName);
      const q = query(usersRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const userDoc = querySnapshot.docs[0];
      const data = userDoc.data() as UserDocument;

      return data;
    } catch {
      throw new Error('사용자 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 사용자 ID로 조회
   */
  async getById(userId: string): Promise<UserDocument | null> {
    try {
      const userRef = doc(firebaseFirestore, this.collectionName, userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      const data = userSnap.data() as UserDocument;
      return data;
    } catch {
      throw new Error('사용자 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 사용자 정보 업데이트
   */
  async update(userId: string, updates: Partial<UserDocument>): Promise<void> {
    try {
      const userRef = doc(firebaseFirestore, this.collectionName, userId);

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userRef, updateData);
    } catch {
      throw new Error('사용자 정보 업데이트에 실패했습니다.');
    }
  }

  /**
   * 사용자 삭제 (회원탈퇴)
   */
  async delete(userId: string): Promise<void> {
    try {
      const userRef = doc(firebaseFirestore, this.collectionName, userId);
      await deleteDoc(userRef);
    } catch {
      throw new Error('사용자 삭제에 실패했습니다.');
    }
  }

  /**
   * 사용자 ID 중복 확인
   */
  async checkUserIdExists(userId: string): Promise<boolean> {
    try {
      const userRef = doc(firebaseFirestore, this.collectionName, userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists();
    } catch {
      return false;
    }
  }

  /**
   * 닉네임 중복 확인
   */
  async checkNicknameExists(nickname: string): Promise<boolean> {
    try {
      const usersRef = collection(firebaseFirestore, this.collectionName);
      const q = query(usersRef, where('nickname', '==', nickname));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch {
      return false;
    }
  }
}

export const userRepository = new FirebaseUserRepository();
