import { z } from 'zod';

/**
 * 환경 변수 스키마 정의
 * - Zod를 사용하여 환경 변수의 타입과 필수 여부 검증
 * - 앱 실행 시점에 환경 변수 누락/오류 감지
 */
const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API 키 (필수)'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase 인증 도메인 (필수)'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase 프로젝트 ID (필수)'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage 버킷 (필수)'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase 메시징 발신자 ID (필수)'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase 앱 ID (필수)'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(), // Firebase 측정 ID (선택)
});

/**
 * 검증된 환경 변수 객체
 * - process.env를 스키마로 검증하여 타입 안전성 보장
 * - 이 객체를 import하면 자동완성 지원
 * - 런타임에 환경 변수 누락 시 명확한 에러 메시지 출력
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
});
