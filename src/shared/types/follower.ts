import { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * Firestore - followers 컬렉션
 * 팔로우 관계
 */
export interface FollowerDocument {
  id?: string; // Document ID
  followerId: string; // 팔로우하는 사람
  followingId: string; // 팔로우당하는 사람

  createdAt: Timestamp | FieldValue;
}
