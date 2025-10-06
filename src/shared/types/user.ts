import { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * 서재 공개 범위
 */
export type LibraryVisibility = 'public' | 'followers' | 'private';

/**
 * Firestore에 저장될 사용자 문서 타입
 */
export interface UserDocument {
  userId: string; // 사용자 정의 ID (책장 주소)
  uid: string; // Firebase UID

  nickname: string; // 닉네임 (필수)
  email: string;
  photoURL?: string;
  bio?: string;

  birth?: string; // 생년월일 (YYMMDD) - 선택
  gender?: 'male' | 'female' | 'other'; // 성별 - 선택

  libraryVisibility: LibraryVisibility; // 서재 공개 범위 (기본값: 'public')

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
