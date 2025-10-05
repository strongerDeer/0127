# 추가 프로젝트 설정 가이드

## 📋 목차

1. [현재 완료된 설정](#현재-완료된-설정)
2. [추가 설정이 필요한 것들](#추가-설정이-필요한-것들)
3. [우선순위별 설정 가이드](#우선순위별-설정-가이드)

---

## ✅ 현재 완료된 설정

### 코드 품질 관리

- **ESLint** - FSD 레이어 강제, 타입 체크
- **Prettier** - 코드 포맷팅, Import 정렬

### Git 자동화

- **Husky** - Git Hooks 자동화
- **lint-staged** - 변경 파일만 검사
- **commitlint** - Conventional Commits 강제

### 개발 환경

- **TypeScript** - Strict Mode
- **Tailwind CSS** - Utility-First CSS
- **FSD 아키텍처** - 레이어 구조 강제

---

## 🔧 추가 설정이 필요한 것들

### 1. 환경 변수 관리 ⭐ (우선순위 높음)

**목적:** API 키, DB 연결 정보 등 민감 정보 관리

```bash
# 파일 구조
.env.local          # 로컬 개발용 (gitignore)
.env.development    # 개발 서버용
.env.production     # 프로덕션용
.env.example        # 예시 파일 (커밋 가능)
```

**타입 안정성:**

```ts
// src/shared/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
  // ...
});

export const env = envSchema.parse(process.env);
```

**장점:**

- 타입 자동완성
- 런타임 전 환경변수 누락 감지
- 잘못된 값 자동 검증

---

### 2. 테스트 환경 구축 (선택)

**Unit Test:**

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**E2E Test:**

```bash
npm install -D @playwright/test
# 또는
npm install -D cypress
```

**커버리지 목표:** 최소 70-80%

---

### 3. CI/CD 파이프라인 ⭐

#### GitHub Actions (Vercel 배포 시)

**`.github/workflows/ci.yml`:**

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

**Vercel 자동 배포:**

- PR 생성 → Preview 배포 자동
- main merge → Production 배포 자동
- **추가 설정 불필요** (Vercel이 자동 처리)

**GitHub Actions가 필요한 경우:**

- ✅ PR에 자동 테스트 실행
- ✅ 빌드 성공 여부 확인 후 merge
- ✅ 커버리지 리포트 자동 생성
- ❌ 배포는 Vercel이 처리 (중복 불필요)

---

### 4. 번들 분석 & 성능 모니터링

**번들 크기 분석:**

```bash
npm install -D @next/bundle-analyzer
```

```js
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
```

**Lighthouse CI:**

```yaml
# .github/workflows/lighthouse.yml
- uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://your-site.vercel.app
    uploadArtifacts: true
```

---

### 5. 에러 모니터링 (프로덕션)

**Sentry 설정:**

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**장점:**

- 실시간 에러 추적
- 사용자 영향도 분석
- 에러 발생 경로 추적

---

### 6. API 문서화

**Swagger/OpenAPI:**

```bash
npm install swagger-ui-react swagger-jsdoc
```

**Storybook:**

```bash
npx storybook@latest init
```

**장점:**

- 컴포넌트 독립 개발
- 시각적 테스트
- 디자인 시스템 문서화

---

### 7. 보안 설정

**Node 버전 고정:**

```bash
# .nvmrc
20.11.0
```

**의존성 보안:**

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
```

**코드 리뷰 담당자:**

```bash
# .github/CODEOWNERS
/src/features/* @yourname
/src/shared/* @yourname
```

---

## 🎯 우선순위별 설정 가이드

### Phase 1: 필수 (현재 프로젝트)

1. ✅ ESLint + Prettier
2. ✅ Husky + Git Hooks
3. ⬜ **환경 변수 관리** (다음 단계)

### Phase 2: 배포 전

1. ⬜ GitHub Actions (CI)
2. ⬜ 번들 분석기
3. ⬜ Lighthouse CI

### Phase 3: 프로덕션

1. ⬜ Sentry (에러 모니터링)
2. ⬜ 테스트 환경 (선택)
3. ⬜ Storybook (선택)

---

## 📝 Vercel 배포 시 주의사항

### 자동으로 처리되는 것

- ✅ PR Preview 배포
- ✅ Production 배포
- ✅ 환경 변수 주입
- ✅ 빌드 최적화

### 수동 설정 필요한 것

- ⚙️ 환경 변수 등록 (Vercel Dashboard)
- ⚙️ 도메인 연결
- ⚙️ Analytics 설정 (선택)

### GitHub Actions 사용 권장 사항

**사용하는 것이 좋은 경우:**

```yaml
# 1. 테스트 자동화
- run: npm test

# 2. 타입 체크 강제
- run: npm run type-check

# 3. 보안 스캔
- uses: snyk/actions/node@master
```

**사용하지 않아도 되는 경우:**

- ❌ 배포 (Vercel이 처리)
- ❌ 빌드 (Vercel이 처리)
- ❌ 미리보기 (Vercel이 처리)

---

## 🚀 다음 단계

### 지금 바로 설정하기

1. **환경 변수 관리**

   ```bash
   npm install zod
   ```

2. **GitHub Actions CI**
   ```bash
   mkdir -p .github/workflows
   # ci.yml 작성
   ```

### 나중에 추가하기

- 테스트 환경 (기능 완성 후)
- 에러 모니터링 (배포 후)
- 번들 분석 (성능 최적화 시)
