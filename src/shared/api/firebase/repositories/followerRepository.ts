import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, where } from 'firebase/firestore';

import type { FollowerDocument } from '@/shared/types/follower';

import { firebaseFirestore } from '../config';

/**
 * Firebase Follower Repository
 * followers 컬렉션 관리 (팔로우 관계)
 */
export class FirebaseFollowerRepository {
  private readonly collectionName = 'followers';

  /**
   * 팔로우 추가
   */
  async create(followerId: string, followingId: string): Promise<string> {
    try {
      const followersRef = collection(firebaseFirestore, this.collectionName);
      const now = serverTimestamp();

      const followerDoc: Omit<FollowerDocument, 'id'> = {
        followerId,
        followingId,
        createdAt: now,
      };

      const docRef = await addDoc(followersRef, followerDoc);
      return docRef.id;
    } catch {
      throw new Error('팔로우 추가에 실패했습니다.');
    }
  }

  /**
   * 언팔로우
   */
  async delete(followerId: string, followingId: string): Promise<void> {
    try {
      const follower = await this.getByFollowerIdAndFollowingId(followerId, followingId);

      if (!follower || !follower.id) {
        throw new Error('팔로우 관계를 찾을 수 없습니다.');
      }

      const followerRef = doc(firebaseFirestore, this.collectionName, follower.id);
      await deleteDoc(followerRef);
    } catch {
      throw new Error('언팔로우에 실패했습니다.');
    }
  }

  /**
   * 특정 팔로우 관계 조회
   */
  async getByFollowerIdAndFollowingId(followerId: string, followingId: string): Promise<FollowerDocument | null> {
    try {
      const followersRef = collection(firebaseFirestore, this.collectionName);
      const q = query(followersRef, where('followerId', '==', followerId), where('followingId', '==', followingId));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as FollowerDocument;
    } catch {
      throw new Error('팔로우 정보를 불러올 수 없습니다.');
    }
  }

  /**
   * 내가 팔로우하는 사람 목록
   */
  async getFollowings(userId: string): Promise<FollowerDocument[]> {
    try {
      const followersRef = collection(firebaseFirestore, this.collectionName);
      const q = query(followersRef, where('followerId', '==', userId));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FollowerDocument[];
    } catch {
      throw new Error('팔로잉 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 나를 팔로우하는 사람 목록
   */
  async getFollowers(userId: string): Promise<FollowerDocument[]> {
    try {
      const followersRef = collection(firebaseFirestore, this.collectionName);
      const q = query(followersRef, where('followingId', '==', userId));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FollowerDocument[];
    } catch {
      throw new Error('팔로워 목록을 불러올 수 없습니다.');
    }
  }

  /**
   * 팔로우 여부 확인
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    try {
      const follower = await this.getByFollowerIdAndFollowingId(followerId, followingId);
      return follower !== null;
    } catch {
      return false;
    }
  }
}

export const followerRepository = new FirebaseFollowerRepository();
