# Git 워크플로우 가이드

> 혼자서도 프로처럼 협업하기

## 📋 목차

- [브랜치 전략](#브랜치-전략)
- [커밋 메시지 컨벤션](#커밋-메시지-컨벤션)
- [Pull Request 작성법](#pull-request-작성법)
- [코드 리뷰 가이드](#코드-리뷰-가이드)
- [실전 시나리오](#실전-시나리오)

---

## 브랜치 전략

### Git Flow (중대형 프로젝트)

```
main (프로덕션)
  ↑
develop (개발 메인)
  ↑
feature/기능명 (기능 개발)
hotfix/버그명 (긴급 수정)
release/버전 (배포 준비)
```

**브랜치 목적:**

| 브랜치     | 용도           | 예시                  |
| ---------- | -------------- | --------------------- |
| main       | 프로덕션 배포  | 항상 배포 가능한 상태 |
| develop    | 개발 통합      | 기능들이 합쳐지는 곳  |
| feature/\* | 새 기능 개발   | feature/user-auth     |
| hotfix/\*  | 긴급 버그 수정 | hotfix/login-error    |
| release/\* | 배포 준비      | release/v1.2.0        |

### GitHub Flow (소규모/개인 프로젝트)

```
main (프로덕션)
  ↑
feature/기능명
```

**장점:**

- 단순함
- 빠른 배포 가능
- 개인 프로젝트에 적합

**추천: 포트폴리오는 GitHub Flow 사용**

---

## 브랜치 네이밍 규칙

### 1. Feature 브랜치

**패턴:** `feature/기능-설명`

```bash
# ✅ 명확한 기능 설명
git checkout -b feature/user-authentication
git checkout -b feature/product-search
git checkout -b feature/bookmark-system

# ❌ 모호함
git checkout -b new-feature
git checkout -b update
git checkout -b fix
```

### 2. Bugfix 브랜치

**패턴:** `bugfix/이슈-설명` 또는 `fix/이슈-설명`

```bash
# ✅ 명확한 버그 설명
git checkout -b bugfix/login-redirect-error
git checkout -b fix/duplicate-api-calls

# GitHub Issue 번호 활용
git checkout -b fix/issue-42
```

### 3. Hotfix 브랜치

**패턴:** `hotfix/긴급-수정-내용`

```bash
# ✅ 프로덕션 긴급 수정
git checkout -b hotfix/payment-failure
git checkout -b hotfix/security-patch
```

### 4. 기타 브랜치

```bash
# 리팩토링
git checkout -b refactor/auth-service

# 문서 작업
git checkout -b docs/api-documentation

# 설정 변경
git checkout -b chore/eslint-config
```

---

## 커밋 메시지 컨벤션

### Conventional Commits 표준

**형식:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 종류

| Type     | 설명               | 예시                          |
| -------- | ------------------ | ----------------------------- |
| feat     | 새 기능            | feat: 사용자 로그인 기능 추가 |
| fix      | 버그 수정          | fix: 로그인 리다이렉트 오류   |
| refactor | 리팩토링           | refactor: 인증 로직 구조 개선 |
| style    | 코드 스타일 (포맷) | style: prettier 적용          |
| docs     | 문서               | docs: README 업데이트         |
| test     | 테스트             | test: 로그인 테스트 추가      |
| chore    | 빌드/설정          | chore: ESLint 설정 추가       |
| perf     | 성능 개선          | perf: 이미지 로딩 최적화      |

### 실전 예제

#### 1. 기본 커밋

```bash
# ✅ 좋은 커밋 메시지
git commit -m "feat: 사용자 로그인 기능 추가"
git commit -m "fix: 상품 검색 시 빈 결과 처리"
git commit -m "refactor: API 클라이언트 타입 안정성 개선"

# ❌ 나쁜 커밋 메시지
git commit -m "update"
git commit -m "fix bug"
git commit -m "asdf"
```

#### 2. Scope 포함

```bash
# Scope로 영향 범위 명시
git commit -m "feat(auth): Google 로그인 추가"
git commit -m "fix(cart): 수량 업데이트 버그 수정"
git commit -m "refactor(api): fetch 로직 통일"
```

#### 3. 상세한 커밋 (Body 포함)

```bash
git commit -m "feat: 북마크 기능 추가

사용자가 상품을 북마크할 수 있는 기능 구현

- entities/bookmark 모델 추가
- features/add-bookmark 기능 구현
- API 연동 완료

Closes #42"
```

**Body 작성 규칙:**

- 무엇을 왜 변경했는지 설명
- 어떻게는 코드가 설명 (생략 가능)
- 관련 이슈 번호 포함 (Closes #42)

#### 4. Breaking Change

```bash
git commit -m "feat!: API 응답 구조 변경

BREAKING CHANGE: 기존 /api/users 응답 형식 변경
- data 래핑 추가: { data: User[] } 형태로 변경
- 기존 코드 마이그레이션 필요"
```

---

## Pull Request 작성법

### PR 제목

**커밋 메시지와 동일한 형식**

```
feat: 사용자 프로필 편집 기능 추가
fix: 상품 이미지 로딩 오류 수정
refactor: 상태 관리 Zustand로 마이그레이션
```

### PR 템플릿

**`.github/pull_request_template.md`:**

```markdown
## 📝 변경 사항

<!-- 무엇을 변경했는지 간략히 설명 -->

## 🎯 작업 내용

<!-- 체크리스트 형태로 구체적인 작업 나열 -->

- [ ] 기능 구현
- [ ] 테스트 작성
- [ ] 문서 업데이트

## 🧪 테스트 방법

<!-- 리뷰어가 테스트할 수 있는 방법 -->

1. 로그인 페이지 접속
2. 이메일/비밀번호 입력
3. 로그인 버튼 클릭
4. 대시보드로 리다이렉트 확인

## 📸 스크린샷 (선택)

<!-- UI 변경 시 스크린샷 첨부 -->

## 🔗 관련 이슈

Closes #42 Related to #38

## 📌 리뷰 포인트

<!-- 특별히 검토가 필요한 부분 -->

- [ ] API 에러 핸들링 로직
- [ ] 타입 안정성
```

### 실전 PR 예제

```markdown
## 📝 변경 사항

사용자가 상품을 북마크할 수 있는 기능 추가

## 🎯 작업 내용

- [x] entities/bookmark 도메인 모델 추가
- [x] features/add-bookmark 기능 구현
- [x] Firebase API 연동
- [x] 낙관적 업데이트(Optimistic Update) 적용
- [x] 에러 핸들링 및 토스트 알림

## 🧪 테스트 방법

1. 상품 상세 페이지 접속
2. 북마크 버튼 클릭
3. 즉시 UI 업데이트 확인
4. 새로고침 후 북마크 유지 확인

## 🔗 관련 이슈

Closes #42

## 📌 리뷰 포인트

- [ ] 낙관적 업데이트 시 에러 발생 시 롤백 로직
- [ ] Zustand store 구조가 적절한지
```

---

## 코드 리뷰 가이드

### 셀프 리뷰 체크리스트 (PR 전)

**기능:**

- [ ] 요구사항을 모두 구현했는가?
- [ ] 엣지 케이스를 처리했는가?
- [ ] 에러 핸들링이 적절한가?

**코드 품질:**

- [ ] 변수/함수명이 명확한가?
- [ ] 중복 코드가 없는가?
- [ ] 주석이 필요한 복잡한 로직에 설명을 추가했는가?

**아키텍처:**

- [ ] FSD 레이어 규칙을 준수했는가?
- [ ] 적절한 레이어에 코드를 배치했는가?
- [ ] Public API만 export했는가?

**타입:**

- [ ] any 타입을 사용하지 않았는가?
- [ ] 모든 함수에 타입이 정의되어 있는가?
- [ ] 타입 추론이 명확한가?

**테스트:**

- [ ] 주요 로직에 테스트를 작성했는가?
- [ ] 엣지 케이스 테스트가 있는가?

**성능:**

- [ ] 불필요한 리렌더링이 없는가?
- [ ] 무한 루프 가능성은 없는가?
- [ ] 메모리 누수 가능성은 없는가?

### 혼자 개발 시 활용법

**1. GitHub PR을 활용한 셀프 리뷰**

```bash
# 기능 개발 완료 후
git push origin feature/bookmark

# GitHub에서 PR 생성 (Draft PR 활용)
# → 변경 사항을 diff로 한눈에 확인
# → 스스로 코멘트 남기며 리뷰
```

**2. AI 코드 리뷰 활용**

- GitHub Copilot
- ChatGPT (코드 붙여넣기)
- CodeRabbit (자동 PR 리뷰)

**3. 시간차 리뷰**

```bash
# 오늘: 기능 구현 및 PR 생성
# 내일: 새로운 시각으로 본인 코드 리뷰
# → 놓친 부분 발견 확률 ↑
```

---

## 실전 시나리오

### 시나리오 1: 새 기능 개발

```bash
# 1. develop에서 feature 브랜치 생성
git checkout develop
git pull origin develop
git checkout -b feature/user-profile-edit

# 2. 작업 수행 (작은 단위로 커밋)
git add .
git commit -m "feat: 프로필 편집 폼 UI 추가"

git add .
git commit -m "feat: 프로필 업데이트 API 연동"

git add .
git commit -m "feat: 이미지 업로드 기능 추가"

# 3. 원격에 푸시
git push origin feature/user-profile-edit

# 4. GitHub에서 PR 생성 (develop ← feature)

# 5. 셀프 리뷰 및 수정

# 6. PR Merge (Squash and Merge 추천)

# 7. 로컬 정리
git checkout develop
git pull origin develop
git branch -d feature/user-profile-edit
```

### 시나리오 2: 버그 수정

```bash
# 1. develop에서 bugfix 브랜치 생성
git checkout develop
git checkout -b fix/login-redirect-error

# 2. 버그 재현 → 수정
git add .
git commit -m "fix: 로그인 후 리다이렉트 경로 수정

로그인 성공 시 이전 페이지로 돌아가지 않고
대시보드로 이동하도록 수정

Closes #87"

# 3. 푸시 및 PR
git push origin fix/login-redirect-error

# 4. Merge 후 정리
```

### 시나리오 3: 긴급 수정 (Hotfix)

```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/payment-failure

# 2. 긴급 수정
git add .
git commit -m "fix!: 결제 실패 오류 긴급 수정

CRITICAL: 결제 API 엔드포인트 변경 반영

- 기존: /api/v1/payment
- 변경: /api/v2/payment"

# 3. main과 develop 양쪽에 병합
git checkout main
git merge hotfix/payment-failure
git push origin main

git checkout develop
git merge hotfix/payment-failure
git push origin develop

# 4. 브랜치 삭제
git branch -d hotfix/payment-failure
```

### 시나리오 4: 충돌 해결

```bash
# 1. develop 최신화 후 feature 브랜치에서 rebase
git checkout develop
git pull origin develop

git checkout feature/my-feature
git rebase develop

# 2. 충돌 발생 시
# → VSCode에서 충돌 해결
# → "Accept Current Change" / "Accept Incoming Change" 선택

# 3. 해결 후 rebase 계속
git add .
git rebase --continue

# 4. 강제 푸시 (rebase 후 필수)
git push origin feature/my-feature --force-with-lease
```

**주의:** `--force-with-lease`는 안전한 강제 푸시 (다른 사람의 작업 보호)

---

## Git Hooks 활용

### Husky 설정 (자동화)

```bash
# 설치
npm install --save-dev husky lint-staged

# Husky 초기화
npx husky init
```

### Pre-commit Hook

**`.husky/pre-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 린트 및 포맷팅 자동 실행
npx lint-staged

# 타입 체크
npm run type-check
```

**`package.json`:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  },
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

### Commit-msg Hook

**커밋 메시지 자동 검증**

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**`.husky/commit-msg`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

**`commitlint.config.js`:**

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'style', 'docs', 'test', 'chore', 'perf'],
    ],
    'subject-case': [2, 'never', ['upper-case']],
  },
};
```

이제 잘못된 커밋 메시지는 자동으로 차단됩니다:

```bash
# ❌ 차단됨
git commit -m "update"
# → type-enum 규칙 위반

# ✅ 통과
git commit -m "feat: 사용자 인증 추가"
```

---

## 유용한 Git 명령어

### 1. 커밋 수정

```bash
# 마지막 커밋 메시지 수정
git commit --amend -m "새로운 메시지"

# 마지막 커밋에 파일 추가 (메시지 유지)
git add forgotten-file.ts
git commit --amend --no-edit
```

### 2. 여러 커밋 합치기

```bash
# 최근 3개 커밋 합치기
git rebase -i HEAD~3

# 에디터에서:
# pick → squash (또는 s) 로 변경
# 커밋 메시지 수정 후 저장
```

### 3. 특정 커밋 되돌리기

```bash
# 특정 커밋만 되돌리기 (새 커밋 생성)
git revert <commit-hash>

# 마지막 커밋 취소 (커밋은 유지, 변경사항만 unstage)
git reset --soft HEAD~1

# 마지막 커밋 완전 삭제 (위험!)
git reset --hard HEAD~1
```

### 4. 임시 저장 (Stash)

```bash
# 현재 작업 임시 저장
git stash

# 다른 브랜치 작업...

# 임시 저장 복원
git stash pop

# Stash 목록 보기
git stash list

# 특정 stash 적용
git stash apply stash@{0}
```

### 5. 브랜치 관리

```bash
# 병합된 브랜치 일괄 삭제
git branch --merged | grep -v "\*" | xargs -n 1 git branch -d

# 원격 브랜치와 동기화
git fetch --prune

# 브랜치 이름 변경
git branch -m old-name new-name
```

---

## 협업 시뮬레이션

### 혼자서도 협업 경험 쌓기

**1. Issue 기반 개발**

```markdown
<!-- GitHub Issue 생성 -->

**제목:** [Feature] 사용자 북마크 기능

**설명:** 사용자가 관심 있는 상품을 북마크할 수 있는 기능이 필요합니다.

**요구사항:**

- [ ] 북마크 추가/제거 버튼
- [ ] 북마크 목록 페이지
- [ ] Firebase 연동

**기술 스택:**

- Zustand (상태 관리)
- Firebase Firestore
```

**2. Feature Branch 전략**

```bash
# Issue 번호를 브랜치명에 포함
git checkout -b feature/42-bookmark-system
```

**3. PR에서 Issue 자동 닫기**

```markdown
## 🔗 관련 이슈

Closes #42
```

PR이 merge되면 Issue #42가 자동으로 닫힙니다.

**4. 프로젝트 보드 활용**

GitHub Projects로 칸반 보드 생성:

- **Todo**: 할 일
- **In Progress**: 진행 중
- **Review**: 리뷰 중
- **Done**: 완료

---

## 핵심 정리

### 브랜치 전략

- 개인 프로젝트: **GitHub Flow** (main + feature 브랜치)
- 팀 프로젝트: **Git Flow** (main + develop + feature/hotfix/release)

### 커밋 메시지

- **Conventional Commits** 형식 준수
- Type: feat, fix, refactor, docs, test, chore 등
- Scope 활용으로 영향 범위 명시
- Body로 상세 설명, Footer로 Issue 연결

### PR 작성

- 명확한 제목 (커밋 메시지 형식)
- 템플릿 활용한 구조화된 설명
- 테스트 방법 명시
- 관련 Issue 연결

### 자동화

- Husky + lint-staged로 코드 품질 자동 검증
- Commitlint로 커밋 메시지 규칙 강제
- GitHub Actions로 CI/CD 구축

---

## 다음 단계

1. **[성능 최적화](./05-performance-guide.md)** - React 성능 개선
2. **[접근성](./06-accessibility-guide.md)** - a11y 가이드
3. **[테스트](./07-testing-guide.md)** - 테스트 전략

---

## 참고 자료

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Husky](https://typicode.github.io/husky/)
