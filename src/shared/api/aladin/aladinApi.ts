import type { AladinBook, AladinSearchParams, AladinSearchResponse } from '@/shared/types/aladin';
import { AladinApiError } from '@/shared/types/aladin';

const ALADIN_API_BASE_URL = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

/**
 * Aladin API 도서 검색
 */
export async function searchBooks(params: AladinSearchParams): Promise<AladinBook[]> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_ALADIN_API_KEY;

    if (!apiKey) {
      throw new AladinApiError('Aladin API Key가 설정되지 않았습니다.');
    }

    const searchParams = new URLSearchParams({
      ttbkey: apiKey,
      Query: params.query,
      QueryType: params.queryType || 'Keyword',
      MaxResults: String(params.maxResults || 10),
      start: String(params.start || 1),
      SearchTarget: params.searchTarget || 'Book',
      output: params.output || 'js',
      Version: params.version || '20131101',
    });

    const url = `${ALADIN_API_BASE_URL}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new AladinApiError(`API 요청 실패: ${response.statusText}`, response.status);
    }

    const data: AladinSearchResponse = await response.json();

    return data.item || [];
  } catch (error) {
    if (error instanceof AladinApiError) {
      throw error;
    }

    throw new AladinApiError('도서 검색 중 오류가 발생했습니다.');
  }
}

/**
 * ISBN으로 도서 상세 정보 조회
 */
export async function getBookByIsbn(isbn: string): Promise<AladinBook | null> {
  try {
    const books = await searchBooks({
      query: isbn,
      queryType: 'Keyword',
      maxResults: 1,
    });

    return books[0] || null;
  } catch (error) {
    if (error instanceof AladinApiError) {
      throw error;
    }

    throw new AladinApiError('도서 정보를 불러올 수 없습니다.');
  }
}
