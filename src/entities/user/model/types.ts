/**
 * 사용자 엔티티 타입 정의
 */
export interface User {
  uid: string; // Firebase 사용자 ID
  email: string | null; // 이메일
  displayName: string | null; // 표시 이름
  photoURL: string | null; // 프로필 사진
}
