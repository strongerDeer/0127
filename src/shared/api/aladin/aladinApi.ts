import type { AladinBook, AladinSearchParams, AladinSearchResponse } from '@/shared/types/aladin';
import { AladinApiError } from '@/shared/types/aladin';

/**
 * Aladin API 도서 검색 (Next.js API Route 사용)
 */
export async function searchBooks(params: AladinSearchParams): Promise<AladinBook[]> {
  try {
    const searchParams = new URLSearchParams({
      query: params.query,
      queryType: params.queryType || 'Keyword',
      maxResults: String(params.maxResults || 10),
      start: String(params.start || 1),
      searchTarget: params.searchTarget || 'Book',
    });

    const url = `/api/aladin/search?${searchParams.toString()}`;

    console.log('[Aladin Client] 도서 검색 요청:', { query: params.query, url });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('[Aladin Client] API 요청 실패:', errorData);
      throw new AladinApiError(errorData.error || `API 요청 실패: ${response.statusText}`, response.status);
    }

    const data: AladinSearchResponse = await response.json();

    console.log('[Aladin Client] 검색 성공:', data.item?.length || 0, '건');

    return data.item || [];
  } catch (error) {
    console.error('[Aladin Client] 예외 발생:', error);

    if (error instanceof AladinApiError) {
      throw error;
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new AladinApiError(`도서 검색 중 오류가 발생했습니다. (${errorMessage})`);
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
