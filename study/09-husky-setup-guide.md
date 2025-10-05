# Husky 설정 가이드

> Git Hook 자동화로 코드 품질 보장하기

## 📋 목차

- [Husky란?](#husky란)
- [기본 설정](#기본-설정)
- [Hook 종류별 설정](#hook-종류별-설정)
- [실전 시나리오](#실전-시나리오)
- [트러블슈팅](#트러블슈팅)

---

## Husky란?

### 개념

**Husky**는 Git Hook을 쉽게 관리할 수 있게 해주는 도구입니다.

**Git Hook이란?**

- Git 작업(commit, push 등) 전후에 자동 실행되는 스크립트
- 코드 품질 검증을 자동화
- 팀 전체가 동일한 규칙 준수

### 왜 필요한가?

**문제 상황:**

```bash
# 개발자 A
git commit -m "fix bug"  # 💩 나쁜 커밋 메시지

# 개발자 B
git commit -m "asdf"     # 💩 린트 에러 포함된 코드 커밋
```

**Husky 적용 후:**

```bash
git commit -m "fix bug"
# ❌ 커밋 메시지가 규칙에 맞지 않아 자동 차단!

git commit -m "fix: 로그인 버그 수정"
# ✅ 자동으로 린트 검사 → 통과 → 커밋 성공
```

---

## 기본 설정

### 1단계: 설치

```bash
# Husky 설치
npm install --save-dev husky

# 초기화
npx husky init
```

**생성되는 파일:**

```
.husky/
└── pre-commit    # 기본 pre-commit hook
```

**package.json 자동 수정:**

```json
{
  "scripts": {
    "prepare": "husky" // npm install 시 자동 실행
  }
}
```

### 2단계: lint-staged 설정

**lint-staged란?**

- 변경된 파일만 검사 (전체 검사는 느림)
- Husky와 함께 사용

```bash
npm install --save-dev lint-staged
```

**package.json에 설정 추가:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 3단계: pre-commit Hook 설정

**`.husky/pre-commit`:**

```bash
npx lint-staged
```

**동작:**

1. 파일 stage (`git add`)
2. `git commit` 실행
3. Husky가 pre-commit hook 실행
4. lint-staged가 변경 파일만 검사
5. ESLint, Prettier 자동 수정
6. 문제 없으면 커밋 완료

---

## Hook 종류별 설정

### 1. pre-commit (커밋 전)

**용도:** 코드 품질 검증

```bash
# .husky/pre-commit
npx lint-staged
```

**실전 예제:**

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 코드 검사 중..."
npx lint-staged

echo "🧪 타입 체크 중..."
npm run type-check
```

**package.json:**

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### 2. commit-msg (커밋 메시지 검증)

**용도:** Gitmoji + 커밋 타입 형식 강제

**`.husky/commit-msg`:**

```bash
#!/bin/sh

# 커밋 메시지 읽기
commit_msg=$(cat "$1")

# 형식: [gitmoji] Type: message
# 예: 🔥 Remove: commitlint 제거
# 예: 📝 Add: 새 기능 추가

# gitmoji + 대문자 시작 Type + 콜론 체크
if ! echo "$commit_msg" | grep -qE '^.+ [A-Z][a-z]+: .+'; then
  echo "❌ 커밋 메시지 형식이 올바르지 않습니다."
  echo ""
  echo "올바른 형식: [gitmoji] Type: message"
  echo "예시:"
  echo "  📝 Add: 새 기능 추가"
  echo "  🔥 Remove: 불필요한 코드 제거"
  echo "  ✨ Update: 기존 기능 개선"
  echo "  🐛 Fix: 버그 수정"
  echo ""
  exit 1
fi

# 최소 길이 체크
if [ ${#commit_msg} -lt 10 ]; then
  echo "❌ 커밋 메시지가 너무 짧습니다. (최소 10자)"
  exit 1
fi

exit 0
```

**동작 예시:**

```bash
# ✅ 통과
git commit -m "📝 Add: 새 기능 추가"
git commit -m "🔥 Remove: 불필요한 코드 제거"
git commit -m "✨ Update: 기존 기능 개선"
git commit -m "🐛 Fix: 버그 수정"

# ❌ 차단됨
git commit -m "add: 새 기능"  # Type이 소문자
git commit -m "update"         # 형식 불일치
git commit -m "Update: 개선"   # gitmoji 없음
```

### 3. pre-push (푸시 전)

**용도:** 테스트 및 빌드 검증

**`.husky/pre-push`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🧪 테스트 실행 중..."
npm test

echo "🏗️ 빌드 확인 중..."
npm run build
```

**주의:** 테스트가 오래 걸리면 push가 느려질 수 있음

### 4. post-commit (커밋 후)

**용도:** 알림, 로그 기록

**`.husky/post-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "✅ 커밋 완료!"
echo "📝 커밋 메시지: $(git log -1 --pretty=%B)"
```

---

## 실전 시나리오

### 시나리오 1: Next.js 프로젝트

**요구사항:**

- TypeScript 타입 체크
- ESLint 검사
- Prettier 포맷팅
- Gitmoji 커밋 형식

**설치:**

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**`.husky/pre-commit`:**

```bash
npx lint-staged
```

**`.husky/commit-msg`:**

```bash
#!/bin/sh

commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE '^.+ [A-Z][a-z]+: .+'; then
  echo "❌ 커밋 메시지 형식: [gitmoji] Type: message"
  exit 1
fi

if [ ${#commit_msg} -lt 10 ]; then
  echo "❌ 커밋 메시지가 너무 짧습니다."
  exit 1
fi

exit 0
```

**`package.json`:**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint",
    "type-check": "tsc --noEmit",
    "prepare": "husky"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
}
```

### 시나리오 2: 테스트 포함 프로젝트

**추가 요구사항:**

- 커밋 전 관련 테스트 실행
- 푸시 전 전체 테스트 실행

**`.husky/pre-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 린트 검사
npx lint-staged

# 변경된 파일 관련 테스트만 실행
npm test -- --findRelatedTests --passWithNoTests
```

**`.husky/pre-push`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 전체 테스트 실행
npm test -- --coverage
```

### 시나리오 3: 팀 협업 프로젝트

**추가 요구사항:**

- 브랜치 네이밍 검증
- 민감 정보 커밋 차단

**`.husky/pre-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 브랜치 네이밍 검증
branch=$(git rev-parse --abbrev-ref HEAD)
if ! echo "$branch" | grep -qE "^(feature|fix|refactor|chore)/"; then
  echo "❌ 브랜치명이 규칙에 맞지 않습니다."
  echo "   형식: feature/*, fix/*, refactor/*, chore/*"
  exit 1
fi

# 민감 정보 체크
if git diff --cached | grep -iE "(api_key|password|secret)"; then
  echo "❌ 민감 정보가 포함되어 있을 수 있습니다!"
  exit 1
fi

# 린트 검사
npx lint-staged
```

---

## 고급 설정

### 1. 조건부 Hook

**특정 브랜치에서만 실행:**

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

branch=$(git rev-parse --abbrev-ref HEAD)

# main 브랜치로 푸시할 때만 테스트 실행
if [ "$branch" = "main" ]; then
  echo "🧪 main 브랜치: 전체 테스트 실행 중..."
  npm test
fi
```

### 2. 성능 최적화

**병렬 실행:**

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 린트와 타입 체크 병렬 실행
npx lint-staged &
npm run type-check &

# 모든 백그라운드 작업 완료 대기
wait
```

### 3. Skip Hook (긴급 상황)

```bash
# Hook 일시 비활성화
git commit --no-verify -m "fix: 긴급 수정"
git push --no-verify

# 또는 환경변수
HUSKY=0 git commit -m "fix: 긴급 수정"
```

**주의:** 팀 규칙상 허용된 경우에만 사용

---

## 트러블슈팅

### 문제 1: Hook이 실행되지 않음

**증상:**

```bash
git commit -m "test"
# Hook이 실행되지 않고 바로 커밋됨
```

**해결:**

```bash
# 1. Husky 재설치
rm -rf .husky
npx husky init

# 2. Git hooks 경로 확인
git config core.hooksPath
# 출력: .husky

# 3. Hook 파일 실행 권한 확인
chmod +x .husky/pre-commit
```

### 문제 2: lint-staged가 너무 느림

**증상:** 커밋할 때마다 1분 이상 소요

**해결:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix --max-warnings=0", // 병렬 실행
      "prettier --write"
    ]
  }
}
```

**추가 최적화:**

```bash
# .husky/pre-commit
# 캐시 활용
npx lint-staged --concurrent false
```

### 문제 3: commitlint가 작동하지 않음

**증상:** 잘못된 커밋 메시지도 통과됨

**해결:**

```bash
# 1. commitlint 설정 파일 확인
ls -la commitlint.config.js

# 2. 수동 테스트
echo "bad commit message" | npx commitlint

# 3. .husky/commit-msg 재생성
cat > .husky/commit-msg << 'EOF'
npx --no -- commitlint --edit $1
EOF

chmod +x .husky/commit-msg
```

### 문제 4: 팀원이 Hook을 우회함

**문제:** `--no-verify` 남용

**해결:**

**1. CI/CD에서도 동일 검증:**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm test
```

**2. 팀 규칙 문서화:**

```markdown
# CONTRIBUTING.md

## Git Hooks

이 프로젝트는 Husky를 사용합니다.

### 규칙

- `--no-verify` 사용 금지 (긴급 상황 제외)
- 커밋 메시지는 Conventional Commits 준수
- 모든 커밋은 린트 통과 필수

### 긴급 상황

긴급 수정이 필요한 경우:

1. `--no-verify` 사용 후 즉시 수정 커밋
2. 팀에 공유
```

---

## 체크리스트

### 초기 설정

- [ ] Husky 설치 및 초기화
- [ ] lint-staged 설정
- [ ] commitlint 설정
- [ ] pre-commit hook 생성
- [ ] commit-msg hook 생성

### 검증

- [ ] 잘못된 코드 커밋 시 차단 확인
- [ ] 잘못된 커밋 메시지 차단 확인
- [ ] 자동 포맷팅 동작 확인
- [ ] 팀원 환경에서 테스트

### 문서화

- [ ] README에 Hook 사용법 추가
- [ ] CONTRIBUTING.md 작성
- [ ] 팀원에게 공유

---

## 템플릿

### 최소 설정 (개인 프로젝트)

```bash
# 설치
npm install --save-dev husky lint-staged
npx husky init

# .husky/pre-commit
npx lint-staged
```

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

### 완전한 설정 (팀 프로젝트)

```bash
# 설치
npm install --save-dev husky lint-staged @commitlint/cli @commitlint/config-conventional

# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run type-check

# .husky/commit-msg
npx --no -- commitlint --edit $1

# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm test
```

```json
{
  "scripts": {
    "prepare": "husky",
    "type-check": "tsc --noEmit"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
};
```

---

## 다음 단계

1. **[VSCode 설정 가이드](./10-vscode-setup-guide.md)** ✅ - 개발 환경 통일
2. **[CI/CD 가이드](./11-cicd-guide.md)** - GitHub Actions 설정

---

## 참고 자료

- [Husky 공식 문서](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [commitlint](https://commitlint.js.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
