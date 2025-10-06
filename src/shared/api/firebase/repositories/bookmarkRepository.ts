import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

import type { BookmarkDocument } from '@/shared/types/book';

import { firebaseFirestore } from '../config';

/**
 * Firebase Bookmark Repository
 * bookmarks 컬렉션 관리 (읽고 싶은 책)
 */
export class FirebaseBookmarkRepository {
  private readonly collectionName = 'bookmarks';

  /**
   * 북마크 추가
   */
  async create(userId: string, isbn: string): Promise<string> {
    try {
      const bookmarksRef = collection(firebaseFirestore, this.collectionName);
      const now = serverTimestamp();

      const bookmarkDoc: Omit<BookmarkDocument, 'id'> = {
        userId,
        isbn,
        createdAt: now,
      };

      const docRef = await addDoc(bookmarksRef, bookmarkDoc);
      return docRef.id;
    } catch {
      throw new Error('북마크 추가에 실패했습니다.');
    }
  }

  /**
   * 사용자의 전체 북마크 조회
   */
  async getByUserId(userId: string): Promise<BookmarkDocument[]> {
    try {
      const bookmarksRef = collection(firebaseFirestore, this.collectionName);
      const q = query(bookmarksRef, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as BookmarkDocument[];
    } catch {
      throw new Error('북마크 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 특정 책의 북마크 조회
   */
  async getByUserIdAndIsbn(userId: string, isbn: string): Promise<BookmarkDocument | null> {
    try {
      const bookmarksRef = collection(firebaseFirestore, this.collectionName);
      const q = query(bookmarksRef, where('userId', '==', userId), where('isbn', '==', isbn));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as BookmarkDocument;
    } catch {
      throw new Error('북마크 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 북마크 삭제
   */
  async delete(userId: string, isbn: string): Promise<void> {
    try {
      const bookmark = await this.getByUserIdAndIsbn(userId, isbn);

      if (!bookmark || !bookmark.id) {
        throw new Error('북마크를 찾을 수 없습니다.');
      }

      const bookmarkRef = doc(firebaseFirestore, this.collectionName, bookmark.id);
      await deleteDoc(bookmarkRef);
    } catch {
      throw new Error('북마크 삭제에 실패했습니다.');
    }
  }

  /**
   * 북마크 여부 확인
   */
  async isBookmarked(userId: string, isbn: string): Promise<boolean> {
    try {
      const bookmark = await this.getByUserIdAndIsbn(userId, isbn);
      return bookmark !== null;
    } catch {
      return false;
    }
  }
}

export const bookmarkRepository = new FirebaseBookmarkRepository();
