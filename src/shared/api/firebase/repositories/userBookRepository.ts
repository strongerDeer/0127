import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import type { ReadingStatus, UserBookDocument } from '@/shared/types/book';

import { firebaseFirestore } from '../config';

/**
 * Firebase UserBook Repository
 * userBooks 컬렉션 관리 (사용자별 읽은/읽는 중인 책)
 */
export class FirebaseUserBookRepository {
  private readonly collectionName = 'userBooks';

  /**
   * 책 등록 (내 서재에 추가)
   */
  async create(data: Omit<UserBookDocument, 'id' | 'createdAt' | 'updatedAt' | 'likesCount'>): Promise<string> {
    try {
      const userBooksRef = collection(firebaseFirestore, this.collectionName);
      const now = serverTimestamp();

      const userBookDoc: Omit<UserBookDocument, 'id'> = {
        ...data,
        likesCount: 0, // 초기 좋아요 수
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await addDoc(userBooksRef, userBookDoc);
      return docRef.id;
    } catch {
      throw new Error('책 등록에 실패했습니다.');
    }
  }

  /**
   * 사용자의 전체 책 조회
   */
  async getByUserId(userId: string, includePrivate: boolean = false): Promise<UserBookDocument[]> {
    try {
      const userBooksRef = collection(firebaseFirestore, this.collectionName);
      let q = query(userBooksRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));

      // 본인이 아니면 공개 책만
      if (!includePrivate) {
        q = query(
          userBooksRef,
          where('userId', '==', userId),
          where('isPublic', '==', true),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserBookDocument[];
    } catch {
      throw new Error('책 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 상태별 조회 (reading, completed)
   */
  async getByStatus(
    userId: string,
    status: ReadingStatus,
    includePrivate: boolean = false
  ): Promise<UserBookDocument[]> {
    try {
      const userBooksRef = collection(firebaseFirestore, this.collectionName);

      const q = includePrivate
        ? query(
            userBooksRef,
            where('userId', '==', userId),
            where('status', '==', status),
            orderBy('createdAt', 'desc')
          )
        : query(
            userBooksRef,
            where('userId', '==', userId),
            where('status', '==', status),
            where('isPublic', '==', true),
            orderBy('createdAt', 'desc')
          );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserBookDocument[];
    } catch {
      throw new Error('책 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 특정 책 조회 (userId + isbn)
   */
  async getByUserIdAndIsbn(userId: string, isbn: string): Promise<UserBookDocument | null> {
    try {
      const userBooksRef = collection(firebaseFirestore, this.collectionName);
      const q = query(userBooksRef, where('userId', '==', userId), where('isbn', '==', isbn));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as UserBookDocument;
    } catch {
      throw new Error('책 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * Document ID로 조회
   */
  async getById(docId: string): Promise<UserBookDocument | null> {
    try {
      const userBookRef = doc(firebaseFirestore, this.collectionName, docId);
      const userBookSnap = await getDoc(userBookRef);

      if (!userBookSnap.exists()) {
        return null;
      }

      return {
        id: userBookSnap.id,
        ...userBookSnap.data(),
      } as UserBookDocument;
    } catch {
      throw new Error('책 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 책 정보 수정
   */
  async update(
    docId: string,
    updates: Partial<Omit<UserBookDocument, 'id' | 'userId' | 'isbn' | 'createdAt'>>
  ): Promise<void> {
    try {
      const userBookRef = doc(firebaseFirestore, this.collectionName, docId);

      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(userBookRef, updateData);
    } catch {
      throw new Error('책 정보 수정에 실패했습니다.');
    }
  }

  /**
   * 책 삭제
   */
  async delete(docId: string): Promise<void> {
    try {
      const userBookRef = doc(firebaseFirestore, this.collectionName, docId);
      await deleteDoc(userBookRef);
    } catch {
      throw new Error('책 삭제에 실패했습니다.');
    }
  }

  /**
   * 중복 체크 (userId + isbn)
   */
  async checkDuplicate(userId: string, isbn: string): Promise<boolean> {
    try {
      const userBook = await this.getByUserIdAndIsbn(userId, isbn);
      return userBook !== null;
    } catch {
      return false;
    }
  }

  /**
   * ISBN으로 모든 사용자의 책 조회 (통계용)
   * - 공개 서재 + 공개 책만
   */
  async getPublicByIsbn(isbn: string): Promise<UserBookDocument[]> {
    try {
      const userBooksRef = collection(firebaseFirestore, this.collectionName);
      const q = query(userBooksRef, where('isbn', '==', isbn), where('isPublic', '==', true));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserBookDocument[];
    } catch {
      throw new Error('책 정보를 불러올 수 없습니다.');
    }
  }
}

export const userBookRepository = new FirebaseUserBookRepository();
