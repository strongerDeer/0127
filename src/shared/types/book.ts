import { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * 책 읽기 상태
 */
export type ReadingStatus = 'reading' | 'completed';

/**
 * 책 평점 (0: 미평가, 1-5: 일반 평점, 10: 인생책)
 */
export type BookRating = 0 | 1 | 2 | 3 | 4 | 5 | 10;

/**
 * Firestore - books 컬렉션
 * 전체 책 마스터 데이터
 */
export interface BookDocument {
  isbn: string; // ISBN (Document ID와 동일)
  isbn13?: string; // ISBN13
  title: string; // 책 제목
  author: string; // 저자
  publisher: string; // 출판사
  pubDate: string; // 출판일 (YYYY-MM-DD)
  description?: string; // 책 소개
  cover: string; // 표지 이미지 URL
  categoryName?: string; // 카테고리
  priceStandard?: number; // 정가

  createdAt: Timestamp | FieldValue; // 최초 등록일
  updatedAt: Timestamp | FieldValue; // 최종 수정일
}

/**
 * Firestore - userBooks 컬렉션
 * 사용자별 읽은/읽는 중인 책
 */
export interface UserBookDocument {
  id?: string; // Document ID (Firestore auto-generated)
  userId: string; // 사용자 ID
  isbn: string; // 책 ISBN (books 컬렉션 참조)

  status: ReadingStatus; // 읽기 상태
  isPublic: boolean; // 개별 책 공개/비공개 (기본값: true)

  rating: BookRating; // 평점 (0: 미평가)
  review?: string; // 한줄평 (공개, 100자 이내)
  memo?: string; // 메모 (비공개)
  tags?: string[]; // 태그 (최대 10개)

  startDate?: Timestamp; // 읽기 시작일 (선택)
  endDate?: Timestamp; // 완독일 (completed일 때 필수)

  likesCount: number; // 좋아요 수 (denormalization)

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}

/**
 * Firestore - bookmarks 컬렉션
 * 읽고 싶은 책 (wish list)
 */
export interface BookmarkDocument {
  id?: string; // Document ID
  userId: string; // 사용자 ID
  isbn: string; // 책 ISBN

  createdAt: Timestamp | FieldValue;
}

/**
 * Firestore - userBookLikes 컬렉션
 * 다른 사람 책에 좋아요
 */
export interface UserBookLikeDocument {
  id?: string; // Document ID
  userBookId: string; // userBooks의 document ID
  userId: string; // 좋아요 누른 사람

  createdAt: Timestamp | FieldValue;
}

/**
 * Firestore - bookStats 컬렉션
 * 책별 통계 캐시 (Firebase Functions로 업데이트)
 */
export interface BookStatsDocument {
  isbn: string; // 책 ISBN (Document ID와 동일)

  totalReaders: number; // 읽은 사람 수 (공개 서재 + 공개 책만)
  totalLikes: number; // 총 좋아요 수
  averageRating: number; // 평균 평점

  // 평점 분포
  ratingDistribution: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    10: number; // 인생책
  };

  // 성별 통계 (선택)
  genderStats?: {
    male: number;
    female: number;
    other: number;
  };

  // 나이대별 통계 (선택)
  ageStats?: {
    [ageGroup: string]: number; // '20대': 15, '30대': 25
  };

  updatedAt: Timestamp | FieldValue;
}

/**
 * UserBook + Book 조인 데이터
 * 내 서재 조회 시 사용
 */
export interface UserBookWithBook extends UserBookDocument {
  book: BookDocument;
}
