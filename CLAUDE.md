# 프로젝트 개발 가이드

## 👤 개발자 프로필

3년차 프론트엔드 개발자

## 🎯 프로젝트 목표

엔터프라이즈급 포트폴리오 프로젝트 완성

- 코드 품질 관리 시스템
- 성능 최적화
- 웹 접근성 준수
- 테스트 전략 적용

## ✨ 구현된 기능 (2025-10-06 기준)

### 인증 시스템

- ✅ Google OAuth 로그인
- ✅ 회원가입 (프로필 이미지 업로드 포함)
- ✅ 아이디/닉네임 중복 체크
- ✅ 프로필 페이지
- ✅ 로그아웃

### 라우터 보호

- ✅ Public Layout - 로그인하지 않은 사용자용 (`/login`, `/signup`)
- ✅ Protected Layout - 로그인 필요한 페이지 (`/profile`)
- ✅ 자동 리다이렉트 처리

### UI/UX

- ✅ Toast 알림 시스템 (shadcn/sonner)
- ✅ 반응형 Header/Footer
- ✅ 로딩 상태 관리
- ✅ 에러 처리

## 📐 아키텍처

### FSD (Feature-Sliced Design)

```
src/
├── shadcn/       # shadcn/ui 라이브러리 (외부, lint 제외)
│   ├── ui/       # shadcn 컴포넌트
│   └── lib/      # shadcn 유틸
├── app/          # Next.js App Router, 전역 설정
├── pages/        # 페이지 컴포넌트
├── widgets/      # 독립적인 블록 (Header, Footer)
├── features/     # 사용자 시나리오 (LoginForm, BookmarkButton)
├── entities/     # 비즈니스 엔티티 (User, Post)
└── shared/       # 공통 코드 (UI Kit, utils, types)
```

**의존성 방향:**

```
app → pages → widgets → features → entities → shared
shadcn (독립)
```

## 🛠️ 기술 스택

### Core

- **Next.js 15** - App Router, Turbopack
- **React 19** - Server Components
- **TypeScript 5** - Strict Mode
- **Tailwind CSS 4** - Utility-First CSS

### UI 라이브러리

- **shadcn/ui** - 재사용 가능한 컴포넌트
- **lucide-react** - 아이콘 라이브러리
- **Radix UI** - Headless UI (shadcn 내부 사용)

### 코드 품질

- **ESLint** - FSD 레이어 강제, Import 순서
- **Prettier** - 코드 포맷팅
- **Husky** - Git Hooks 자동화
- **lint-staged** - 변경 파일만 검사
- **commitlint** - Conventional Commits 강제

### 데이터

- **Firebase** - 인증, DB, 스토리지
- **Zod** - 환경 변수 검증

## 📝 코드 작성 규칙 (⚠️ 필수 준수)

### 1. 🔴 UI/비즈니스 로직 완전 분리 (최우선)

**Container/Presenter 패턴 적용:**

```tsx
// ❌ 나쁜 예: UI와 로직 혼재
export function SignupForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const response = await fetch('/api/signup', { ... })
    // 복잡한 로직...
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={loading}>가입</button>
    </form>
  )
}

// ✅ 좋은 예: Container + Presenter 패턴
// features/auth/ui/SignupForm.tsx (Container)
export function SignupForm() {
  const router = useRouter()
  const { firebaseUser } = useAuth()

  const {
    form,
    errors,
    isSubmitting,
    handleSubmit,
  } = useJoinForm({
    firebaseUser,
    onSuccess: () => {
      toast.success('회원가입이 완료되었습니다!')
      router.push('/profile')
    },
  })

  return (
    <SignupFormUI
      form={form}
      errors={errors}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
    />
  )
}

// features/auth/ui/SignupFormUI.tsx (Presenter - 순수 UI만)
export function SignupFormUI({ form, errors, isSubmitting, onSubmit }: Props) {
  const { register } = form

  return (
    <form onSubmit={onSubmit}>
      <Input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      <Button disabled={isSubmitting}>가입</Button>
    </form>
  )
}

// features/auth/model/useJoinForm.ts (비즈니스 로직만)
export function useJoinForm({ firebaseUser, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<JoinFormData>({
    resolver: zodResolver(joinFormSchema),
  })

  const onSubmit = useCallback(async (data: JoinFormData) => {
    setIsSubmitting(true)
    try {
      await createUser(firebaseUser.uid, data)
      onSuccess()
    } finally {
      setIsSubmitting(false)
    }
  }, [firebaseUser, onSuccess])

  return {
    form,
    errors: form.formState.errors,
    isSubmitting,
    handleSubmit: form.handleSubmit(onSubmit),
  }
}
```

**핵심 원칙:**

- Container: 데이터 로직, 상태 관리, API 호출
- Presenter: 순수 UI 렌더링, props로만 동작
- Model (Custom Hook): 비즈니스 로직, 상태 관리

### 2. 🔴 파일명/함수명 규칙 (엄격히 준수)

**파일명 규칙:**

```
✅ 좋은 예:
features/auth/ui/SignupForm.tsx           # Container
features/auth/ui/SignupFormUI.tsx         # Presenter
features/auth/model/useAuth.ts            # Custom Hook
features/auth/model/useJoinForm.ts        # Custom Hook
features/auth/api/userApi.ts              # API 함수
features/auth/types/joinForm.ts           # 타입 정의
shared/constants/imageValidation.ts       # 상수

❌ 나쁜 예:
features/auth/signup.tsx                  # 역할 불명확
features/auth/hooks.ts                    # 너무 포괄적
features/auth/utils.ts                    # 모호함
```

**함수명 규칙:**

```tsx
// ❌ 나쁜 예
const d = new Date()
const handleClick = () => { ... }
const check = () => { ... }
const data = fetchData()

// ✅ 좋은 예
const currentDate = new Date()
const handleUserLogin = () => { ... }
const checkUserIdAvailable = () => { ... }
const userData = await fetchUserData()
```

**불리언 네이밍 (is/has/can 필수):**

```tsx
// 상태
const isLoading = true;
const isNewUser = false;
const hasError = false;
const canEdit = true;

// 함수
const checkIsValid = () => boolean;
const verifyHasPermission = () => boolean;
```

**이벤트 핸들러 네이밍:**

```tsx
// ✅ 좋은 예
const handleUserIdCheck = () => { ... }      # 사용자 ID 중복 체크
const handleImageChange = () => { ... }      # 이미지 변경
const handleFormSubmit = () => { ... }       # 폼 제출
const handleLogout = () => { ... }           # 로그아웃

// ❌ 나쁜 예
const onClick = () => { ... }                # 무엇을 클릭?
const handleChange = () => { ... }           # 무엇을 변경?
const onSubmit = () => { ... }               # 핸들러는 handle 접두사
```

### 3. 최소 커밋 단위

**작업 흐름:**

```bash
# 1. 기능 브랜치 생성
git checkout -b feature/user-profile

# 2. 작은 단위로 개발 → 커밋
git add .
git commit -m "feat: 사용자 프로필 UI 추가"

# 3. 계속 개발 → 커밋
git commit -m "feat: 프로필 수정 기능 추가"

# 4. PR 생성
gh pr create
```

**커밋 메시지 규칙 (Conventional Commits):**

```
feat: 새 기능
fix: 버그 수정
refactor: 리팩토링
style: 코드 스타일
docs: 문서
test: 테스트
chore: 빌드/설정
perf: 성능 개선
```

## 🔧 개발 환경 설정

### 필수 확장 프로그램

VSCode에서 프로젝트 열면 자동으로 추천:

- Prettier - 코드 포맷터
- ESLint - 린트 검사
- Tailwind CSS IntelliSense - 클래스 자동완성
- Path Intellisense - 경로 자동완성
- Auto Rename Tag - 태그 자동 수정

### 자동 실행

**저장 시 (Cmd+S):**

1. Prettier 자동 포맷팅
2. ESLint 자동 수정
3. Import 자동 정렬
4. 미사용 import 제거

**커밋 시:**

1. lint-staged가 변경 파일만 검사
2. ESLint 에러 있으면 커밋 차단
3. 커밋 메시지 규칙 검증
4. 통과하면 커밋 완료

## 📚 학습 자료

`study/` 폴더에 체계적으로 정리:

1. **[ESLint + Prettier 가이드](./study/01-eslint-prettier-guide.md)** - 코드 품질 관리
2. **[폴더 구조 가이드](./study/02-folder-structure-guide.md)** - FSD 아키텍처
3. **[네이밍 컨벤션](./study/03-naming-convention-guide.md)** - 일관된 코드 작성
4. **[Git 워크플로우](./study/04-git-workflow-guide.md)** - 협업 프로세스
5. **[성능 최적화](./study/05-performance-guide.md)** - React/Next.js 최적화
6. **[웹 접근성](./study/06-accessibility-guide.md)** - WCAG 2.1 준수
7. **[테스트 전략](./study/07-testing-guide.md)** - Unit/E2E 테스트
8. **[트러블슈팅](./study/08-troubleshooting-guide.md)** - 문제 해결 방법론
9. **[Husky 설정](./study/09-husky-setup-guide.md)** - Git Hooks 자동화
10. **[VSCode 설정](./study/10-vscode-setup-guide.md)** - 개발 환경 통일
11. **[추가 설정 가이드](./study/11-additional-setup-guide.md)** - 프로덕션 배포 준비
12. **[Zod 가이드](./study/12-zod-guide.md)** - 환경 변수 검증
13. **[shadcn + FSD 가이드](./study/13-shadcn-fsd-guide.md)** - UI 라이브러리 통합

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 새 기능 개발

```bash
# 브랜치 생성
git checkout -b feature/기능명

# 코드 작성 (FSD 구조 준수)
# 커밋 (Conventional Commits)
# PR 생성
```

## ✅ 코드 작성 체크리스트

### 개발 전

- [ ] 어느 레이어에 속하는지 확인 (features? entities?)
- [ ] 네이밍이 명확한지 확인
- [ ] UI/비즈니스 로직 분리 계획

### 개발 중

- [ ] 코드 가독성 우선
- [ ] 함수는 한 가지 역할만
- [ ] 타입 안전성 확보 (any 금지)

### 커밋 전

- [ ] ESLint 에러 없음 (자동 체크)
- [ ] Prettier 포맷팅 완료 (자동 실행)
- [ ] 커밋 메시지 규칙 준수 (자동 검증)

### PR 전

- [ ] 브랜치명 규칙 준수 (feature/_, fix/_)
- [ ] 셀프 리뷰 완료
- [ ] 테스트 작성 (해당 시)

## 🔍 트러블슈팅

### ESLint 에러

```bash
# 수동 검사
npm run lint

# 자동 수정
npm run lint -- --fix
```

### 커밋이 안 될 때

```bash
# Hook 확인
ls -la .husky/

# 수동 실행
npx lint-staged
npx commitlint --edit .git/COMMIT_EDITMSG
```

### Prettier 안 될 때

```
VSCode:
Cmd+Shift+P → Format Document
설정 → Format On Save 켜기
```

## 📌 핵심 원칙

1. **코드 품질 > 개발 속도** - 자동화로 품질 보장
2. **작은 커밋 > 큰 커밋** - 리뷰 가능한 단위로 분할
3. **명확한 구조 > 복잡한 패턴** - FSD로 일관성 유지
4. **문서화 필수** - `study/` 폴더에 학습 내용 정리
