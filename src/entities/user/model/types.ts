/**
 * 사용자 엔티티 타입 정의
 */
export interface User {
  uid: string; // Firebase 사용자 ID
  email: string | null; // 이메일
  displayName: string | null; // 표시 이름
  photoURL: string | null; // 프로필 사진
}

/**
 * Firestore에 저장될 사용자 문서 타입
 * @deprecated Use UserDocument from @/shared/types/user instead
 */
export type { UserDocument } from '@/shared/types/user';

/**
 * 회원가입 시 필요한 데이터
 */
export interface UserRegistrationData {
  nickname: string; // 닉네임 (필수)
  bio?: string; // 소개글 (선택)
  birth?: string; // 생년월일 (선택)
  gender?: 'male' | 'female' | 'other'; // 성별 (선택)
}
