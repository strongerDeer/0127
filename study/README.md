# 개발 학습 가이드

> 포트폴리오 완성을 위한 엔터프라이즈급 개발 가이드

## 📚 가이드 목록

### 1. [ESLint + Prettier 설정 가이드](./01-eslint-prettier-guide.md)

코드 품질 관리 시스템

**학습 내용:**

- FSD 아키텍처 강제를 위한 ESLint 설정
- Import 순서 자동 정렬
- TypeScript Strict 규칙
- Pre-commit Hook 자동화

**핵심 개념:**

- ESLint와 Prettier의 역할 구분
- Husky + lint-staged로 자동화
- Conventional Commits

---

### 2. [폴더 구조 가이드](./02-folder-structure-guide.md)

Feature-Sliced Design 아키텍처

**학습 내용:**

- FSD 레이어 구조 (app, pages, widgets, features, entities, shared)
- 레이어별 역할과 의존성 규칙
- Public API 패턴
- 실전 예제 (북마크 기능 개발)

**핵심 개념:**

```
app → pages → widgets → features → entities → shared
      (상위)                                  (하위)
```

---

### 3. [네이밍 컨벤션 가이드](./03-naming-convention-guide.md)

일관된 코드 작성을 위한 명명 규칙

**학습 내용:**

- 파일/폴더 네이밍 (PascalCase, camelCase, kebab-case)
- 변수/함수 네이밍 (is/has 접두사, 동사+명사)
- TypeScript 타입 네이밍
- 실전 예제 (폼 검증, API 연동)

**핵심 패턴:**

- 불리언: `isLoading`, `hasError`, `canEdit`
- 함수: `fetchUser`, `handleClick`, `onSuccess`
- 타입: `UserProps`, `ApiResponse<T>`

---

### 4. [Git 워크플로우 가이드](./04-git-workflow-guide.md)

혼자서도 프로처럼 협업하기

**학습 내용:**

- Git Flow vs GitHub Flow
- 브랜치 전략 (feature, bugfix, hotfix)
- Conventional Commits
- Pull Request 작성법
- 충돌 해결

**핵심 명령어:**

```bash
# 기능 개발
git checkout -b feature/user-authentication
git commit -m "feat: 사용자 로그인 기능 추가"
git push origin feature/user-authentication

# PR 생성 → 리뷰 → Merge → 브랜치 삭제
```

---

### 5. [성능 최적화 가이드](./05-performance-guide.md)

실전 성능 개선 기법

**학습 내용:**

- Lighthouse 성능 측정
- React 최적화 (React.memo, useMemo, useCallback)
- Next.js 최적화 (Server Components, ISR, Streaming)
- 번들 크기 최적화
- 이미지 최적화

**핵심 기법:**

- 가상 스크롤로 긴 리스트 최적화
- React Query로 캐싱
- Dynamic Import로 코드 분할
- Next.js Image 컴포넌트

---

### 6. [웹 접근성 가이드](./06-accessibility-guide.md)

모두를 위한 웹 만들기

**학습 내용:**

- WCAG 2.1 기준 (Level AA 목표)
- 시맨틱 HTML
- 키보드 접근성
- 스크린 리더 지원
- ARIA 속성

**핵심 체크리스트:**

- 모든 이미지에 alt 속성
- 모든 input에 label
- 키보드로 모든 기능 사용 가능
- 색상 대비 4.5:1 이상
- 제목 계층 올바름

---

### 7. [테스트 전략 가이드](./07-testing-guide.md)

안정적인 코드를 위한 테스트

**학습 내용:**

- 테스트 피라미드 (Unit 60%, Integration 30%, E2E 10%)
- Vitest + Testing Library
- React 컴포넌트 테스트
- Playwright E2E 테스트
- TDD (Test-Driven Development)

**핵심 패턴:**

```ts
// AAA 패턴
describe('formatCurrency', () => {
  it('should format number to currency', () => {
    // Arrange
    const amount = 10000;

    // Act
    const result = formatCurrency(amount);

    // Assert
    expect(result).toBe('₩10,000');
  });
});
```

---

### 8. [트러블 슈팅 가이드](./08-troubleshooting-guide.md)

문제 해결 방법론과 실전 사례

**학습 내용:**

- 문제 해결 프로세스 (정의 → 재현 → 분석 → 해결 → 검증 → 문서화)
- 자주 발생하는 문제와 해결책
- 디버깅 기법
- 트러블 슈팅 템플릿

**핵심 기법:**

- 5W1H로 문제 정의
- 이분 탐색으로 원인 분석
- Chrome DevTools 활용
- 포트폴리오에 녹이기

---

## 🎯 학습 로드맵

### 1주차: 기초 설정

- [ ] ESLint + Prettier 설정 (01)
- [ ] FSD 폴더 구조 이해 (02)
- [ ] 네이밍 컨벤션 적용 (03)

### 2주차: 협업과 품질

- [ ] Git 워크플로우 실습 (04)
- [ ] 첫 PR 작성 및 셀프 리뷰
- [ ] Husky + lint-staged 설정

### 3주차: 성능과 접근성

- [ ] Lighthouse 성능 측정 (05)
- [ ] React 최적화 기법 적용
- [ ] 웹 접근성 체크리스트 점검 (06)

### 4주차: 테스트와 문서화

- [ ] Unit 테스트 작성 (07)
- [ ] E2E 테스트 작성
- [ ] 트러블 슈팅 문서 작성 (08)

---

## 💡 포트폴리오 활용법

### README.md에 추가할 내용

```markdown
## 💎 기술적 성과

### 코드 품질

- **ESLint + Prettier**: FSD 아키텍처 강제 및 자동 포맷팅
- **TypeScript Strict 모드**: any 타입 금지, 100% 타입 안정성
- **Pre-commit Hook**: Husky로 커밋 전 자동 검증

### 성능 최적화

- **로딩 시간 50% 단축**: 가상 스크롤 + 이미지 최적화
- **Lighthouse 92점**: Performance 47점 향상 (45→92)
- **번들 크기 30% 감소**: Tree Shaking + Dynamic Import

### 접근성

- **WCAG 2.1 Level AA 준수**: 키보드 접근, 스크린 리더 지원
- **색상 대비 4.5:1 이상**: 모든 텍스트 가독성 확보

### 테스트

- **테스트 커버리지 85%**: Unit + Integration + E2E
- **TDD 적용**: 핵심 비즈니스 로직
```

### 면접 대비 질문

**Q: FSD 아키텍처를 왜 선택했나요?**

> "레이어별 의존성 방향이 명확해 순환 참조를 원천 차단하고, ESLint로 이를 강제하여 팀 협업 시에도
> 일관된 구조를 유지할 수 있기 때문입니다."

**Q: 성능 최적화를 어떻게 했나요?**

> "Lighthouse로 측정한 결과 LCP가 4.2초였습니다. 가상 스크롤, React.memo, Next.js Image를 적용하여
> 1.5초로 50% 단축했고, Lighthouse 점수도 92점으로 향상했습니다."

**Q: 웹 접근성을 왜 고려했나요?**

> "모든 사용자가 정보에 접근할 수 있어야 한다는 원칙과 함께, SEO 개선과 코드 품질 향상에도 도움이
> 되기 때문입니다. WCAG 2.1 Level AA를 목표로 시맨틱 HTML과 ARIA를 적용했습니다."

---

## 📌 실전 적용 순서

### 프로젝트 시작 시

1. **설정 (1일)**

   ```bash
   npm install --save-dev eslint prettier husky lint-staged
   npx husky init
   ```

2. **폴더 구조 (1일)**

   ```
   src/
   ├── app/
   ├── shared/
   └── (기능 추가 시 entities, features, widgets)
   ```

3. **첫 기능 개발 (1주)**
   - FSD 레이어별로 코드 배치
   - 네이밍 컨벤션 준수
   - Git 브랜치 전략 적용
   - PR 작성 및 셀프 리뷰

### 기능 개발 시

```
1. Issue 생성 → GitHub Issue
2. 브랜치 생성 → feature/기능명
3. TDD 적용 → 테스트 먼저 작성
4. 개발 → FSD 구조 준수
5. 최적화 → React.memo, useMemo
6. 접근성 → aria-label, alt
7. 테스트 → Unit + Integration
8. PR 생성 → 템플릿 활용
9. 문서화 → 트러블 슈팅 로그
```

---

## 🚀 다음 단계

### 추가 학습 주제

1. **상태 관리 심화**
   - Zustand 고급 패턴
   - React Query 최적화
   - Optimistic Update

2. **디자인 시스템**
   - Storybook 구축
   - Design Token
   - 컴포넌트 문서화

3. **CI/CD**
   - GitHub Actions
   - Vercel 배포 자동화
   - 테스트 자동화

4. **모니터링**
   - Sentry 에러 추적
   - Vercel Analytics
   - 사용자 행동 분석

---

## 📖 참고 자료

### 공식 문서

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)

### 아키텍처

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### 코드 품질

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

### 테스트

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)

### 성능/접근성

- [Web.dev](https://web.dev/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 💬 피드백

이 가이드에 대한 피드백이나 추가할 내용이 있다면:

- GitHub Issue 생성
- PR로 기여

**함께 성장하는 개발자가 되어요! 🌱**
