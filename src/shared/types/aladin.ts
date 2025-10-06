/**
 * Aladin API 응답 타입
 */

/**
 * 도서 검색 응답
 */
export interface AladinSearchResponse {
  version: string;
  title: string;
  link: string;
  pubDate: string;
  totalResults: number;
  startIndex: number;
  itemsPerPage: number;
  query: string;
  searchCategoryId: number;
  searchCategoryName: string;
  item: AladinBook[];
}

/**
 * Aladin API 도서 정보
 */
export interface AladinBook {
  title: string; // 제목
  link: string; // 상세 페이지 URL
  author: string; // 저자
  pubDate: string; // 출판일 (YYYY-MM-DD)
  description: string; // 책 소개
  isbn: string; // ISBN
  isbn13: string; // ISBN13
  itemId: number; // 알라딘 상품 ID
  priceSales: number; // 판매가
  priceStandard: number; // 정가
  mallType: string; // 판매처 타입
  stockStatus: string; // 재고 상태
  mileage: number; // 마일리지
  cover: string; // 표지 이미지 URL
  categoryId: number; // 카테고리 ID
  categoryName: string; // 카테고리명
  publisher: string; // 출판사
  salesPoint: number; // 판매지수
  adult: boolean; // 성인 도서 여부
  fixedPrice: boolean; // 정가제 여부
  customerReviewRank: number; // 고객 평점
  subInfo?: {
    // 추가 정보 (선택)
    itemPage?: number; // 페이지 수
    subTitle?: string; // 부제목
    originalTitle?: string; // 원제
  };
}

/**
 * 도서 검색 파라미터
 */
export interface AladinSearchParams {
  query: string; // 검색어
  queryType?: 'Title' | 'Author' | 'Publisher' | 'Keyword'; // 검색 타입 (기본: Keyword)
  maxResults?: number; // 최대 결과 수 (기본: 10, 최대: 100)
  start?: number; // 시작 인덱스 (기본: 1)
  searchTarget?: 'Book' | 'Foreign' | 'Music' | 'DVD' | 'Used' | 'eBook' | 'All'; // 검색 대상 (기본: Book)
  output?: 'js' | 'xml'; // 출력 형식 (기본: js)
  version?: string; // API 버전 (기본: 20131101)
}

/**
 * Aladin API 에러
 */
export class AladinApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AladinApiError';
  }
}
