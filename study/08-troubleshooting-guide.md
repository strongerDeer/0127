# 트러블 슈팅 가이드

> 문제 해결 방법론과 실전 사례

## 📋 목차

- [문제 해결 프로세스](#문제-해결-프로세스)
- [자주 발생하는 문제](#자주-발생하는-문제)
- [디버깅 기법](#디버깅-기법)
- [트러블 슈팅 템플릿](#트러블-슈팅-템플릿)
- [문서화 전략](#문서화-전략)

---

## 문제 해결 프로세스

### 1. 문제 정의

**5W1H로 명확히 하기:**

```markdown
- **What**: 무엇이 문제인가?
- **When**: 언제 발생하는가?
- **Where**: 어디서 발생하는가?
- **Who**: 누가 영향을 받는가?
- **Why**: 왜 발생하는가?
- **How**: 어떻게 재현하는가?
```

**예시:**

```markdown
**문제**: 로그인 후 페이지가 무한 로딩

- What: 로그인 성공 후 대시보드 페이지가 로딩만 계속됨
- When: 로그인 API 호출 성공 직후
- Where: /dashboard 페이지
- Who: 모든 사용자
- Why: (조사 필요)
- How: 1. 이메일/비밀번호 입력 2. 로그인 버튼 클릭 3. 무한 로딩
```

### 2. 재현 (Reproduce)

```markdown
**재현 단계:**

1. 환경: Chrome 브라우저, localhost:3000
2. 사용자: test@example.com / password123
3. 단계:
   - 로그인 페이지 접속
   - 이메일/비밀번호 입력
   - 로그인 버튼 클릭
4. 결과: 무한 로딩

**재현율:** 10/10 (100%)
```

### 3. 원인 분석

**이분 탐색 (Binary Search):**

```
전체 코드 (문제 있음)
  ↓ 반으로 나누기
API 호출 부분 (문제 없음) | 상태 관리 부분 (문제 있음)
  ↓ 다시 반으로
useEffect (문제 있음) | Zustand store (문제 없음)
  ↓ 세부 분석
의존성 배열 누락 → 무한 루프 발견!
```

**로그 추가:**

```tsx
// Before
useEffect(() => {
  fetchUserData();
}, []);

// Debugging
useEffect(() => {
  console.log('🔍 useEffect 실행');
  console.log('📊 dependencies:', [user]);
  fetchUserData();
}, [user]); // ← 문제: user가 계속 변경됨
```

### 4. 해결 (Fix)

**임시 해결 (Workaround):**

```tsx
// Quick Fix (임시)
useEffect(() => {
  if (!user) {
    fetchUserData();
  }
}, [user]);
```

**근본 해결 (Root Cause):**

```tsx
// Root Fix
useEffect(() => {
  fetchUserData();
}, []); // user를 의존성에서 제거

// 또는 useRef로 안정화
const userRef = useRef(user);
useEffect(() => {
  fetchUserData();
}, [userRef.current?.id]); // ID만 추적
```

### 5. 검증 (Verify)

```markdown
**검증 체크리스트:**

- [x] 원래 문제 해결됨
- [x] 새로운 버그 발생 안 함
- [x] 다른 브라우저에서도 정상 동작
- [x] 엣지 케이스 테스트 (빈 값, 에러 등)
- [x] 성능 영향 없음
```

### 6. 문서화 (Document)

```markdown
## 문제: 로그인 후 무한 로딩

**증상:** 로그인 성공 후 대시보드 페이지가 무한 로딩

**원인:** useEffect의 의존성 배열에 user 객체를 추가하여 user가 업데이트될 때마다 다시
fetchUserData()를 호출하고, 이것이 user를 업데이트하여 무한 루프 발생

**해결:** 의존성 배열에서 user 제거, 또는 user.id만 추적

**관련 커밋:** abc123 **관련 PR:** #42
```

---

## 자주 발생하는 문제

### 1. Next.js 빌드 에러

#### 문제: Hydration Mismatch

```
Error: Hydration failed because the initial UI does not match what was rendered on the server.
```

**원인:** 서버와 클라이언트 렌더링 결과가 다름

```tsx
// ❌ 문제 코드
function Component() {
  return <div>{new Date().toLocaleString()}</div>; // 서버/클라이언트 시간 다름
}

// ✅ 해결
'use client';

function Component() {
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    setDate(new Date().toLocaleString());
  }, []);

  return <div>{date || '로딩 중...'}</div>;
}
```

#### 문제: Cannot find module

```
Module not found: Can't resolve '@/components/Button'
```

**해결 체크리스트:**

```bash
# 1. tsconfig.json 확인
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

# 2. 파일 존재 확인
ls src/components/Button.tsx

# 3. 캐시 삭제
rm -rf .next
npm run build

# 4. node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### 2. React Hook 에러

#### 문제: Hooks can only be called inside function components

```tsx
// ❌ 조건문 안에서 Hook
function Component({ isActive }) {
  if (isActive) {
    const [value, setValue] = useState(0); // ❌
  }
}

// ✅ 최상위에서 Hook
function Component({ isActive }) {
  const [value, setValue] = useState(0);

  if (!isActive) return null;

  return <div>{value}</div>;
}
```

#### 문제: useEffect 무한 루프

```tsx
// ❌ 무한 루프
useEffect(() => {
  setData({ ...data, updated: true }); // data가 계속 변경
}, [data]);

// ✅ 해결 1: 의존성 제거
useEffect(() => {
  setData((prev) => ({ ...prev, updated: true }));
}, []);

// ✅ 해결 2: 특정 프로퍼티만 추적
useEffect(() => {
  setData({ ...data, updated: true });
}, [data.id]); // id만 추적
```

### 3. TypeScript 타입 에러

#### 문제: Type 'X' is not assignable to type 'Y'

```tsx
// ❌ 타입 불일치
interface User {
  id: string;
  name: string;
}

const user = { id: 1, name: 'John' }; // id가 number
const typedUser: User = user; // ❌ 에러

// ✅ 해결 1: 타입 맞추기
const user: User = { id: '1', name: 'John' };

// ✅ 해결 2: 변환 함수
function toUser(data: any): User {
  return {
    id: String(data.id),
    name: data.name,
  };
}
```

#### 문제: Object is possibly 'null' or 'undefined'

```tsx
// ❌ null 체크 없음
function Component({ user }: { user: User | null }) {
  return <div>{user.name}</div>; // ❌ user가 null일 수 있음
}

// ✅ 해결 1: Optional Chaining
return <div>{user?.name}</div>;

// ✅ 해결 2: Early Return
if (!user) return null;
return <div>{user.name}</div>;

// ✅ 해결 3: Non-null Assertion (확실할 때만)
return <div>{user!.name}</div>;
```

### 4. API 관련 에러

#### 문제: CORS Error

```
Access to fetch at 'https://api.example.com' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

**해결 (개발 환경):**

```js
// next.config.ts
export default {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.example.com/:path*',
      },
    ];
  },
};
```

**해결 (프로덕션):**

서버에서 CORS 헤더 추가:

```js
// Backend (예: Express)
app.use(
  cors({
    origin: 'https://your-app.com',
    credentials: true,
  })
);
```

#### 문제: 401 Unauthorized

```tsx
// ✅ 인증 토큰 자동 추가
async function fetchWithAuth(url: string) {
  const token = localStorage.getItem('token');

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    // 토큰 만료 → 로그인 페이지
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response.json();
}
```

### 5. 성능 문제

#### 문제: 페이지가 느림

**진단:**

```bash
# 1. Lighthouse 실행
F12 → Lighthouse → Analyze

# 2. Performance 탭 녹화
F12 → Performance → Record → Stop

# 3. 번들 분석
ANALYZE=true npm run build
```

**일반적인 원인:**

```tsx
// ❌ 문제 1: 큰 라이브러리 전체 import
import _ from 'lodash'; // 70KB

// ✅ 해결
import { debounce } from 'lodash-es'; // 5KB

// ❌ 문제 2: 최적화 안 된 이미지
<img src="/huge-image.jpg" /> // 5MB

// ✅ 해결
import Image from 'next/image';
<Image src="/image.jpg" width={800} height={600} />

// ❌ 문제 3: 불필요한 리렌더링
const Component = ({ items }) => {
  const sorted = items.sort(); // 매번 정렬
  return <List items={sorted} />;
};

// ✅ 해결
const Component = ({ items }) => {
  const sorted = useMemo(() => items.sort(), [items]);
  return <List items={sorted} />;
};
```

---

## 디버깅 기법

### 1. Console Debugging

```tsx
// 기본
console.log('값:', value);

// 객체 출력
console.table({ name: 'John', age: 30 });

// 그룹화
console.group('User Data');
console.log('Name:', user.name);
console.log('Email:', user.email);
console.groupEnd();

// 조건부 로그
console.assert(value > 0, '값이 0보다 작습니다', value);

// 시간 측정
console.time('API Call');
await fetchData();
console.timeEnd('API Call'); // API Call: 234.56ms

// 콜스택 출력
console.trace('여기까지 어떻게 왔는지');
```

### 2. Chrome DevTools

**Breakpoint 설정:**

```tsx
function handleClick() {
  debugger; // ← 여기서 멈춤
  const result = calculate(value);
  return result;
}
```

**Conditional Breakpoint:**

```
우클릭 → Add conditional breakpoint → value > 100
```

**Network 탭:**

```
- Slow 3G로 테스트
- Preserve log 체크
- Filter: XHR로 API만 보기
```

### 3. React DevTools

```tsx
// Components 탭
- props 확인
- state 확인
- hooks 값 확인
- 렌더링 하이라이트

// Profiler 탭
- 느린 컴포넌트 찾기
- 리렌더링 횟수 확인
```

### 4. Source Map

**프로덕션 디버깅:**

```js
// next.config.ts
export default {
  productionBrowserSourceMaps: true, // 프로덕션에서도 소스맵
};
```

**주의:** 배포 시 보안을 위해 비활성화 권장

---

## 트러블 슈팅 템플릿

### 이슈 템플릿 (.github/ISSUE_TEMPLATE/bug_report.md)

```markdown
---
name: Bug Report
about: 버그 리포트
---

## 🐛 버그 설명

명확하고 간결한 버그 설명

## 🔄 재현 단계

1. '...'로 이동
2. '...' 클릭
3. '...'까지 스크롤
4. 에러 발생

## ✅ 기대 동작

어떻게 동작해야 하는지

## ❌ 실제 동작

실제로 어떻게 동작하는지

## 📸 스크린샷

(가능하면 스크린샷 첨부)

## 🌍 환경

- OS: [예: macOS 14.0]
- 브라우저: [예: Chrome 120]
- Node 버전: [예: 20.10.0]
- Next.js 버전: [예: 15.0.0]

## 📝 추가 정보

기타 문맥 정보
```

### PR 템플릿 (.github/PULL_REQUEST_TEMPLATE.md)

```markdown
## 🐛 해결한 문제

Closes #이슈번호

## 🔧 변경 사항

- [ ] 변경 1
- [ ] 변경 2

## 🧪 테스트 방법

1. 테스트 단계 1
2. 테스트 단계 2

## 📸 Before/After

(선택) 스크린샷

## ✅ 체크리스트

- [ ] 로컬에서 테스트 완료
- [ ] 타입 에러 없음
- [ ] ESLint 통과
- [ ] 관련 문서 업데이트
```

### 트러블 슈팅 로그 (study/troubleshooting-log.md)

```markdown
# 트러블 슈팅 로그

## 2024-01-15: 로그인 무한 로딩

**문제:** 로그인 성공 후 무한 로딩

**원인:** useEffect 의존성 배열에 user 객체 추가로 무한 루프

**해결:**

\`\`\`tsx // Before useEffect(() => { fetchUserData(); }, [user]);

// After useEffect(() => { fetchUserData(); }, []); \`\`\`

**학습:**

- useEffect 의존성은 primitive 값만 추천
- 객체는 useMemo로 안정화
- 무한 루프 의심 시 의존성 배열 먼저 확인

**참고:**

- PR: #42
- Commit: abc123
```

---

## 문서화 전략

### 1. README.md 구조

```markdown
# 프로젝트명

## 📌 개요

프로젝트 간단 설명

## 🚀 시작하기

\`\`\`bash npm install npm run dev \`\`\`

## 🏗️ 기술 스택

- Next.js 15
- TypeScript
- Tailwind CSS
- Zustand

## 📁 폴더 구조

\`\`\` src/ ├── app/ ├── entities/ ├── features/ └── shared/ \`\`\`

## 🧪 테스트

\`\`\`bash npm test \`\`\`

## 📚 문서

- [API 문서](./docs/api.md)
- [컴포넌트 가이드](./docs/components.md)

## 🐛 트러블슈팅

[트러블슈팅 가이드](./docs/troubleshooting.md) 참고

## 🤝 기여

[CONTRIBUTING.md](./CONTRIBUTING.md) 참고
```

### 2. 코드 주석 규칙

```tsx
/**
 * 사용자 로그인 함수
 *
 * @param email - 사용자 이메일
 * @param password - 비밀번호
 * @returns User 객체
 * @throws {Error} 인증 실패 시
 *
 * @example
 * const user = await login('test@example.com', 'password');
 */
export async function login(email: string, password: string): Promise<User> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('인증 실패');
  }

  return response.json();
}

// ✅ 복잡한 로직에만 주석
// 이메일 중복 체크를 위한 디바운스 적용 (500ms)
const debouncedCheck = useDebouncedCallback(checkEmail, 500);

// ❌ 불필요한 주석
// 변수 선언
const value = 10;
```

### 3. API 문서화

```markdown
# API 문서

## POST /api/auth/login

로그인 API

**Request:**

\`\`\`json { "email": "test@example.com", "password": "password123" } \`\`\`

**Response (200):**

\`\`\`json { "user": { "id": "1", "name": "John", "email": "test@example.com" }, "token":
"eyJhbGc..." } \`\`\`

**Error (401):**

\`\`\`json { "error": "Invalid credentials" } \`\`\`
```

### 4. 변경 이력 (CHANGELOG.md)

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### Added

- 북마크 기능 추가
- 다크 모드 지원

### Changed

- 로그인 페이지 UI 개선

### Fixed

- 로그인 후 무한 로딩 버그 수정 (#42)

### Deprecated

- `oldAPI()` 함수 (v2.0에서 제거 예정)

## [1.1.0] - 2024-01-01

...
```

---

## 포트폴리오에 녹이기

### 1. 트러블 슈팅 문서 작성

```markdown
# 프로젝트 트러블 슈팅

## 1. 성능 최적화: 상품 목록 로딩 시간 50% 단축

**문제:** 상품 목록 페이지 로딩 시간 3초 → 사용자 이탈률 증가

**분석:**

- Lighthouse Performance: 45점
- Largest Contentful Paint: 4.2s
- 원인: 1000개 아이템을 한 번에 렌더링

**해결:**

1. 가상 스크롤 도입 (react-virtual)
2. 이미지 지연 로딩 (next/image)
3. 데이터 페이지네이션

**결과:**

- 로딩 시간: 3s → 1.5s (50% 개선)
- Lighthouse: 45점 → 92점
- 사용자 이탈률: 30% → 15% (50% 감소)

**기술:** React.memo, useMemo, @tanstack/react-virtual
```

### 2. GitHub README에 추가

```markdown
## 💡 핵심 성과

### 성능 최적화

- 상품 목록 로딩 시간 **50% 단축** (3s → 1.5s)
- 가상 스크롤 도입으로 메모리 사용량 **80% 감소**
- Lighthouse Performance **47점 향상** (45 → 92)

### 문제 해결

- useEffect 무한 루프 디버깅 및 해결
- Hydration Mismatch 이슈 근본 원인 분석 및 수정
- CORS 에러 우회를 위한 Proxy 설정

[상세 트러블 슈팅 보기](./docs/troubleshooting.md)
```

---

## 핵심 정리

### 문제 해결 프로세스

1. **정의**: 5W1H로 명확히
2. **재현**: 단계별로 정확히
3. **분석**: 이분 탐색 + 로그
4. **해결**: 임시 → 근본 해결
5. **검증**: 다각도 테스트
6. **문서화**: 나중을 위해

### 디버깅 체크리스트

- [ ] Console.log로 값 확인
- [ ] Chrome DevTools Breakpoint
- [ ] React DevTools로 컴포넌트 추적
- [ ] Network 탭으로 API 확인
- [ ] Lighthouse로 성능 측정

### 문서화 원칙

- **Why** > **How**: 왜 이렇게 했는지 설명
- **Before/After**: 변경 전후 비교
- **학습 내용**: 다음에 활용할 지식
- **참고 링크**: Issue, PR, Commit 연결

---

## 참고 자료

- [Next.js Debugging](https://nextjs.org/docs/app/building-your-application/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Keep a Changelog](https://keepachangelog.com/)
