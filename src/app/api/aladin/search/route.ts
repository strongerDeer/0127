import { NextRequest, NextResponse } from 'next/server';

const ALADIN_API_BASE_URL = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const queryType = searchParams.get('queryType') || 'Keyword';
    const maxResults = searchParams.get('maxResults') || '10';
    const start = searchParams.get('start') || '1';
    const searchTarget = searchParams.get('searchTarget') || 'Book';

    if (!query) {
      return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_ALADIN_API_KEY;

    if (!apiKey) {
      console.error('[Aladin API Route] API Key 누락');
      return NextResponse.json({ error: 'API Key가 설정되지 않았습니다.' }, { status: 500 });
    }

    const aladinParams = new URLSearchParams({
      ttbkey: apiKey,
      Query: query,
      QueryType: queryType,
      MaxResults: maxResults,
      start,
      SearchTarget: searchTarget,
      output: 'js',
      Version: '20131101',
    });

    const url = `${ALADIN_API_BASE_URL}?${aladinParams.toString()}`;

    console.log('[Aladin API Route] 도서 검색:', { query, queryType, url });

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Aladin API Route] API 요청 실패:', response.status, response.statusText);
      return NextResponse.json({ error: `API 요청 실패: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    console.log('[Aladin API Route] 검색 성공:', data.item?.length || 0, '건');

    return NextResponse.json(data);
  } catch (error) {
    console.error('[Aladin API Route] 예외 발생:', error);

    return NextResponse.json(
      {
        error: '도서 검색 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
