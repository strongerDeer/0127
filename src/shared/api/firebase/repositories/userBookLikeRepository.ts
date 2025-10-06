import { collection, doc, getDocs, increment, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';

import type { UserBookLikeDocument } from '@/shared/types/book';

import { firebaseFirestore } from '../config';

/**
 * Firebase UserBookLike Repository
 * userBookLikes 컬렉션 관리 (다른 사람 책에 좋아요)
 */
export class FirebaseUserBookLikeRepository {
  private readonly collectionName = 'userBookLikes';
  private readonly userBooksCollectionName = 'userBooks';

  /**
   * 좋아요 추가 (Transaction)
   * - userBookLikes에 문서 생성
   * - userBooks의 likesCount 증가
   */
  async create(userBookId: string, userId: string): Promise<string> {
    try {
      const batch = writeBatch(firebaseFirestore);

      // 1. userBookLikes에 문서 추가
      const likesRef = collection(firebaseFirestore, this.collectionName);
      const likeDocRef = doc(likesRef);

      const likeDoc: Omit<UserBookLikeDocument, 'id'> = {
        userBookId,
        userId,
        createdAt: serverTimestamp(),
      };

      batch.set(likeDocRef, likeDoc);

      // 2. userBooks의 likesCount 증가
      const userBookRef = doc(firebaseFirestore, this.userBooksCollectionName, userBookId);
      batch.update(userBookRef, {
        likesCount: increment(1),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      return likeDocRef.id;
    } catch {
      throw new Error('좋아요 추가에 실패했습니다.');
    }
  }

  /**
   * 좋아요 취소 (Transaction)
   * - userBookLikes에서 문서 삭제
   * - userBooks의 likesCount 감소
   */
  async delete(userBookId: string, userId: string): Promise<void> {
    try {
      const like = await this.getByUserBookIdAndUserId(userBookId, userId);

      if (!like || !like.id) {
        throw new Error('좋아요를 찾을 수 없습니다.');
      }

      const batch = writeBatch(firebaseFirestore);

      // 1. userBookLikes에서 문서 삭제
      const likeRef = doc(firebaseFirestore, this.collectionName, like.id);
      batch.delete(likeRef);

      // 2. userBooks의 likesCount 감소
      const userBookRef = doc(firebaseFirestore, this.userBooksCollectionName, userBookId);
      batch.update(userBookRef, {
        likesCount: increment(-1),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
    } catch {
      throw new Error('좋아요 취소에 실패했습니다.');
    }
  }

  /**
   * 특정 책의 좋아요 조회
   */
  async getByUserBookIdAndUserId(userBookId: string, userId: string): Promise<UserBookLikeDocument | null> {
    try {
      const likesRef = collection(firebaseFirestore, this.collectionName);
      const q = query(likesRef, where('userBookId', '==', userBookId), where('userId', '==', userId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as UserBookLikeDocument;
    } catch {
      throw new Error('좋아요 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 사용자가 좋아요한 전체 책 조회
   */
  async getByUserId(userId: string): Promise<UserBookLikeDocument[]> {
    try {
      const likesRef = collection(firebaseFirestore, this.collectionName);
      const q = query(likesRef, where('userId', '==', userId));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserBookLikeDocument[];
    } catch {
      throw new Error('좋아요 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 좋아요 여부 확인
   */
  async isLiked(userBookId: string, userId: string): Promise<boolean> {
    try {
      const like = await this.getByUserBookIdAndUserId(userBookId, userId);
      return like !== null;
    } catch {
      return false;
    }
  }
}

export const userBookLikeRepository = new FirebaseUserBookLikeRepository();
