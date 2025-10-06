import { FieldValue, Timestamp } from 'firebase/firestore';

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

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
