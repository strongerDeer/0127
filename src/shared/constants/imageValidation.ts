/**
 * 이미지 업로드 검증 상수
 */
export const IMAGE_VALIDATION = {
  /** 최대 파일 크기 (5MB) */
  MAX_SIZE: 5 * 1024 * 1024,
  /** 허용 파일 타입 */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  /** 에러 메시지 */
  ERRORS: {
    SIZE_EXCEEDED: '파일 크기는 5MB 이하여야 합니다',
    INVALID_TYPE: '이미지 파일만 업로드 가능합니다',
  },
} as const;
