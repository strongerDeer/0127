import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'firebase/firestore';

import type { BookStatsDocument } from '@/shared/types/book';

import { firebaseFirestore } from '../config';

/**
 * Firebase BookStats Repository
 * bookStats 컬렉션 관리 (읽기 전용 - Firebase Functions가 업데이트)
 */
export class FirebaseBookStatsRepository {
  private readonly collectionName = 'bookStats';

  /**
   * ISBN으로 통계 조회
   */
  async getByIsbn(isbn: string): Promise<BookStatsDocument | null> {
    try {
      const statsRef = doc(firebaseFirestore, this.collectionName, isbn);
      const statsSnap = await getDoc(statsRef);

      if (!statsSnap.exists()) {
        return null;
      }

      return statsSnap.data() as BookStatsDocument;
    } catch {
      throw new Error('통계 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 인기 책 Top N 조회 (totalReaders 기준)
   */
  async getPopular(limitCount: number = 20): Promise<BookStatsDocument[]> {
    try {
      const statsRef = collection(firebaseFirestore, this.collectionName);
      const q = query(statsRef, orderBy('totalReaders', 'desc'), limit(limitCount));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as BookStatsDocument);
    } catch {
      throw new Error('인기 책 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 평점 높은 책 Top N 조회
   */
  async getTopRated(limitCount: number = 20): Promise<BookStatsDocument[]> {
    try {
      const statsRef = collection(firebaseFirestore, this.collectionName);
      const q = query(statsRef, orderBy('averageRating', 'desc'), limit(limitCount));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as BookStatsDocument);
    } catch {
      throw new Error('평점 높은 책 목록을 불러올 수 없습니다.');
    }
  }
}

export const bookStatsRepository = new FirebaseBookStatsRepository();
