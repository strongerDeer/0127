import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import type { BookDocument } from '@/shared/types/book';

import { firebaseFirestore } from '../config';

/**
 * Firebase Book Repository
 * books 컬렉션 관리
 */
export class FirebaseBookRepository {
  private readonly collectionName = 'books';

  /**
   * 책 생성
   */
  async create(bookData: Omit<BookDocument, 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const bookRef = doc(firebaseFirestore, this.collectionName, bookData.isbn);
      const now = serverTimestamp();

      const bookDoc: BookDocument = {
        ...bookData,
        createdAt: now,
        updatedAt: now,
      };

      await setDoc(bookRef, bookDoc);
    } catch {
      throw new Error('책 정보 저장에 실패했습니다.');
    }
  }

  /**
   * ISBN으로 책 조회
   */
  async getByIsbn(isbn: string): Promise<BookDocument | null> {
    try {
      const bookRef = doc(firebaseFirestore, this.collectionName, isbn);
      const bookSnap = await getDoc(bookRef);

      if (!bookSnap.exists()) {
        return null;
      }

      return bookSnap.data() as BookDocument;
    } catch {
      throw new Error('책 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 최신 등록순 책 조회
   */
  async getRecent(limitCount: number = 20): Promise<BookDocument[]> {
    try {
      const booksRef = collection(firebaseFirestore, this.collectionName);
      const q = query(booksRef, orderBy('createdAt', 'desc'), limit(limitCount));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as BookDocument);
    } catch {
      throw new Error('책 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 책 삭제
   * (registerCount가 0이 되었을 때 사용)
   */
  async delete(isbn: string): Promise<void> {
    try {
      const bookRef = doc(firebaseFirestore, this.collectionName, isbn);
      await deleteDoc(bookRef);
    } catch {
      throw new Error('책 삭제에 실패했습니다.');
    }
  }

  /**
   * 책 존재 여부 확인
   */
  async exists(isbn: string): Promise<boolean> {
    try {
      const bookRef = doc(firebaseFirestore, this.collectionName, isbn);
      const bookSnap = await getDoc(bookRef);
      return bookSnap.exists();
    } catch {
      return false;
    }
  }
}

export const bookRepository = new FirebaseBookRepository();
