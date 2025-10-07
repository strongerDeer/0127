# CORS 및 외부 API 통합 가이드

## 📋 목차

1. [CORS란?](#cors란)
2. [문제 상황](#문제-상황)
3. [해결 방법: Next.js API Route](#해결-방법-nextjs-api-route)
4. [구현 예시: Aladin API](#구현-예시-aladin-api)
5. [에러 로깅 전략](#에러-로깅-전략)
6. [보안 고려사항](#보안-고려사항)

---

## CORS란?

### Cross-Origin Resource Sharing

브라우저에서 다른 도메인의 리소스를 요청할 때 발생하는 보안 정책

```
클라이언트 (localhost:3000)
    ↓ ❌ CORS 에러
외부 API (aladin.co.kr)
```

### CORS 에러가 발생하는 이유

- 브라우저는 보안상 다른 출처(Origin)의 리소스 요청을 제한
- 서버가 `Access-Control-Allow-Origin` 헤더를 제공하지 않으면 차단
- **서버 측에서는 CORS 에러가 발생하지 않음** (브라우저 정책)

---

## 문제 상황

### Aladin API 직접 호출 시 CORS 에러

**문제 코드:**

```typescript
// ❌ 클라이언트에서 직접 호출 → CORS 에러
export async function searchBooks(params: AladinSearchParams) {
  const response = await fetch('http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?...', {
    method: 'GET',
  });
  // Access to fetch at 'http://www.aladin.co.kr/...' from origin 'http://localhost:3000'
  // has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
}
```

**에러 메시지:**

```
Access to fetch at 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?...'
from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 해결 방법: Next.js API Route

### 서버를 통한 프록시 패턴

```
클라이언트 (localhost:3000)
    ↓ ✅ 같은 도메인
Next.js API Route (/api/aladin/search)
    ↓ ✅ 서버에서 요청 (CORS 제한 없음)
외부 API (aladin.co.kr)
```

### 아키텍처

```
src/
├── app/
│   └── api/
│       └── aladin/
│           └── search/
│               └── route.ts          # 서버 API Route
└── shared/
    └── api/
        └── aladin/
            └── aladinApi.ts           # 클라이언트 API 함수
```

---

## 구현 예시: Aladin API

### 1. 서버 API Route 생성

**파일:** `src/app/api/aladin/search/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const ALADIN_API_BASE_URL = 'http://www.aladin.co.kr/ttb/api/ItemSearch.aspx';

export async function GET(request: NextRequest) {
  try {
    // 1. 클라이언트 요청에서 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const queryType = searchParams.get('queryType') || 'Keyword';
    const maxResults = searchParams.get('maxResults') || '10';
    const start = searchParams.get('start') || '1';
    const searchTarget = searchParams.get('searchTarget') || 'Book';

    // 2. 필수 파라미터 검증
    if (!query) {
      return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
    }

    // 3. API Key 확인 (서버 환경변수)
    const apiKey = process.env.NEXT_PUBLIC_ALADIN_API_KEY;

    if (!apiKey) {
      console.error('[Aladin API Route] API Key 누락');
      return NextResponse.json({ error: 'API Key가 설정되지 않았습니다.' }, { status: 500 });
    }

    // 4. 외부 API 요청 파라미터 생성
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

    // 5. 외부 API 호출 (서버에서 요청 → CORS 없음)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 6. 에러 처리
    if (!response.ok) {
      console.error('[Aladin API Route] API 요청 실패:', response.status, response.statusText);
      return NextResponse.json(
        { error: `API 요청 실패: ${response.statusText}` },
        { status: response.status }
      );
    }

    // 7. 응답 반환
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
```

### 2. 클라이언트 API 함수 수정

**파일:** `src/shared/api/aladin/aladinApi.ts`

```typescript
import type { AladinBook, AladinSearchParams, AladinSearchResponse } from '@/shared/types/aladin';
import { AladinApiError } from '@/shared/types/aladin';

/**
 * Aladin API 도서 검색 (Next.js API Route 사용)
 */
export async function searchBooks(params: AladinSearchParams): Promise<AladinBook[]> {
  try {
    // 1. 클라이언트 → Next.js API Route 요청
    const searchParams = new URLSearchParams({
      query: params.query,
      queryType: params.queryType || 'Keyword',
      maxResults: String(params.maxResults || 10),
      start: String(params.start || 1),
      searchTarget: params.searchTarget || 'Book',
    });

    const url = `/api/aladin/search?${searchParams.toString()}`;

    console.log('[Aladin Client] 도서 검색 요청:', { query: params.query, url });

    // 2. API Route 호출 (같은 도메인 → CORS 없음)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 3. 에러 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      console.error('[Aladin Client] API 요청 실패:', errorData);
      throw new AladinApiError(
        errorData.error || `API 요청 실패: ${response.statusText}`,
        response.status
      );
    }

    // 4. 응답 파싱
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
```

---

## 에러 로깅 전략

### 계층별 로깅

```
[Aladin Client] 도서 검색 요청: { query: '해리포터', url: '/api/aladin/search?query=해리포터...' }
  ↓
[Aladin API Route] 도서 검색: { query: '해리포터', queryType: 'Keyword', url: 'http://www.aladin.co.kr/...' }
  ↓
[Aladin API Route] 검색 성공: 10 건
  ↓
[Aladin Client] 검색 성공: 10 건
```

### 로그 레벨 구분

**정상 흐름:**

```typescript
console.log('[Aladin Client] 도서 검색 요청:', { query, url });
console.log('[Aladin Client] 검색 성공:', data.item?.length || 0, '건');
```

**에러 발생:**

```typescript
console.error('[Aladin Client] API 요청 실패:', errorData);
console.error('[Aladin Client] 예외 발생:', error);
```

### 상세 에러 정보 제공

```typescript
// ❌ 나쁜 예: 에러 정보 손실
catch (error) {
  throw new AladinApiError('도서 검색 중 오류가 발생했습니다.');
}

// ✅ 좋은 예: 원본 에러 포함
catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  throw new AladinApiError(`도서 검색 중 오류가 발생했습니다. (${errorMessage})`);
}
```

---

## 보안 고려사항

### 1. API Key 관리

**서버 환경변수 사용:**

```typescript
// ✅ 서버에서만 접근
const apiKey = process.env.NEXT_PUBLIC_ALADIN_API_KEY;
```

**.env.local:**

```bash
NEXT_PUBLIC_ALADIN_API_KEY=your_api_key_here
```

### 2. 입력값 검증

```typescript
// 필수 파라미터 체크
if (!query) {
  return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 });
}

// 파라미터 길이 제한 (선택)
if (query.length > 100) {
  return NextResponse.json({ error: '검색어는 100자 이내로 입력해주세요.' }, { status: 400 });
}
```

### 3. Rate Limiting (선택)

```typescript
import { rateLimit } from '@/shared/lib/rateLimit';

export async function GET(request: NextRequest) {
  // IP 기반 요청 제한
  const rateLimitResult = await rateLimit(request);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: '요청 횟수 제한을 초과했습니다.' }, { status: 429 });
  }

  // ...
}
```

---

## 핵심 정리

### CORS 해결 플로우

```
1. 클라이언트에서 외부 API 직접 호출 → ❌ CORS 에러
2. Next.js API Route 생성 (서버 프록시)
3. 클라이언트 → API Route → 외부 API → ✅ 성공
```

### 체크리스트

- [ ] Next.js API Route 생성 (`src/app/api/...`)
- [ ] 클라이언트 함수 수정 (API Route 호출)
- [ ] 에러 로깅 추가 (디버깅용)
- [ ] 환경변수 설정 (API Key)
- [ ] 입력값 검증 (보안)

### 참고 자료

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [MDN: CORS](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
