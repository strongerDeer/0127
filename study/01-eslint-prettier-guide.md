# ESLint + Prettier 설정 가이드

> 코드 품질 관리 시스템

### 📋 목차

- [현재 설정 분석](#현재-설정-분석)
- [ESLint 상세 가이드](#eslint-상세-가이드)
- [Prettier 상세 가이드](#prettier-상세-가이드)
- [통합 워크플로우](#통합-워크플로우)
- [추가 권장 설정](#추가-권장-설정)

---

## 현재 설정 분석

### 1. **FSD 아키텍처 강제 (Layer 격리)**

```js
'import/no-restricted-paths': [
  'error',
  {
    zones: [
      // shared는 상위 레이어를 import 불가
      // entities는 features 이상 레이어 import 불가
      // features는 widgets 이상 레이어 import 불가
    ],
  },
];
```

**왜 중요한가?**

- 의존성 방향이 명확해져 순환 참조 방지
- 레이어별 책임이 분명해짐
- 코드 리팩토링 시 영향 범위를 예측 가능
- 대규모 프로젝트에서 코드베이스가 스파게티화되는 것을 원천 차단

### 2. **Import 순서 자동 정렬 (Prettier)**

```json
"importOrder": [
  "^react$",           // React 최상단
  "^next",             // Next.js
  "^@?\\w",            // 외부 라이브러리
  "^@/entities/(.*)$", // FSD 레이어 순서대로
  "^@/features/(.*)$",
  "^@/shared/(.*)$",
  // ...
  "^[./]"              // 상대 경로
]
```

**장점:**

- 코드 리뷰 시 import 순서로 인한 diff 최소화
- 가독성 향상 (파일 상단만 봐도 의존성 파악 가능)
- 팀 전체가 동일한 import 스타일 유지
- 새로운 팀원도 일관된 코드 작성 가능

### 3. **TypeScript Strict 규칙**

```js
'@typescript-eslint/no-explicit-any': 'error', // any 타입 금지
'@typescript-eslint/no-unused-vars': [
  'error',
  { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
],
```

**효과:**

- 타입 안정성 보장으로 런타임 에러 사전 방지
- IDE 자동완성 품질 향상
- 리팩토링 시 타입 체크로 안전하게 변경 가능
- `any` 금지로 타입 시스템의 실질적 이점 확보

---

## ESLint 상세 가이드

### 1. **React 관련 규칙**

```js
'react/react-in-jsx-scope': 'off', // Next.js 13+에서는 불필요
'react/prop-types': 'off', // TypeScript 사용 시 불필요
```

**추가 권장 규칙:**

```js
'react-hooks/rules-of-hooks': 'error', // Hook 규칙 강제
'react-hooks/exhaustive-deps': 'warn', // useEffect 의존성 검사
```

**실무 적용:**

- `rules-of-hooks`: Hook을 조건문/반복문 안에서 호출하는 실수 방지
- `exhaustive-deps`: useEffect의 누락된 의존성을 경고하여 버그 사전 차단

### 2. **Production vs Development 환경 분리**

```js
'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
```

**실무 팁:**

```js
// 개발 중에는 console.log 허용
console.log('디버깅 중...');

// Production 빌드 시 자동으로 에러 발생
// → 배포 전 제거 강제
```

이렇게 설정하면 개발 편의성은 유지하면서 프로덕션 코드 품질도 보장할 수 있습니다.

### 3. **Unused Variables 관리**

```js
'@typescript-eslint/no-unused-vars': [
  'error',
  {
    argsIgnorePattern: '^_', // _로 시작하는 변수는 무시
    varsIgnorePattern: '^_',
  },
],
```

**사용 예시:**

```tsx
// ❌ 에러 발생
function Component({ userId, userName }) {
  // userId만 사용
  return <div>{userId}</div>;
}

// ✅ 정상 (_로 명시적으로 미사용 표시)
function Component({ userId, userName: _userName }) {
  return <div>{userId}</div>;
}
```

이 패턴은 "일부러 사용하지 않는 변수"임을 명시적으로 표현할 수 있어 코드 의도가 명확해집니다.

---

## Prettier 상세 가이드

### 🎨 코드 스타일 통일

#### 1. **기본 포맷팅 규칙**

```json
{
  "semi": true, // 세미콜론 필수
  "singleQuote": true, // 작은따옴표 사용
  "tabWidth": 2, // 들여쓰기 2칸
  "printWidth": 80, // 한 줄 최대 80자
  "trailingComma": "es5" // ES5 호환 trailing comma
}
```

**왜 이렇게 설정했나?**

| 설정              | 이유                                       |
| ----------------- | ------------------------------------------ |
| `printWidth: 80`  | GitHub diff 가독성 최적화 (코드 리뷰 효율) |
| `singleQuote`     | JavaScript 커뮤니티 표준                   |
| `trailingComma`   | Git diff 최소화 (마지막 줄만 변경됨)       |
| `arrowParens`     | TypeScript 타입 추론 명확성                |
| `jsxSingleQuote`  | JSX와 JS 일관성 유지                       |
| `bracketSameLine` | 가독성 향상 (닫는 태그가 새 줄에 위치)     |

특히 `printWidth: 80`은 코드 리뷰 시 GitHub에서 가로 스크롤 없이 볼 수 있어 리뷰 효율이 크게
향상됩니다.

#### 2. **파일 타입별 Override**

```json
{
  "overrides": [
    {
      "files": "*.json",
      "options": { "printWidth": 120 } // JSON은 더 길게 허용
    },
    {
      "files": "*.md",
      "options": { "proseWrap": "always" } // Markdown 자동 줄바꿈
    },
    {
      "files": "*.{css,scss}",
      "options": { "singleQuote": false } // CSS는 쌍따옴표
    }
  ]
}
```

파일 타입별로 최적화된 포맷팅을 적용하면 각 언어의 관습을 존중하면서도 일관성을 유지할 수 있습니다.

---

## 통합 워크플로우

### 🔄 개발 → 커밋 → 배포 자동화

#### 1. **VSCode 설정 (.vscode/settings.json)**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"]
}
```

이 설정을 프로젝트에 포함시키면 모든 팀원이 동일한 개발 환경을 가질 수 있습니다.

#### 2. **package.json Scripts 추가**

```json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix .",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "check": "npm run lint && npm run format"
  }
}
```

**실무 활용:**

- `npm run lint`: CI/CD에서 코드 검증
- `npm run lint:fix`: 로컬에서 자동 수정
- `npm run format`: 전체 프로젝트 포맷팅
- `npm run check`: PR 전 최종 점검

#### 3. **Pre-commit Hook (Husky + lint-staged)**

```bash
npm install --save-dev husky lint-staged
npx husky init
```

**`.husky/pre-commit`:**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**`package.json`:**

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

이렇게 설정하면 커밋 시 자동으로 변경된 파일만 검사하여 빠르고 효율적인 코드 품질 관리가 가능합니다.

---

## 추가 권장 설정

### 🚀 더 나은 코드 품질을 위한 확장

#### 1. **접근성 (a11y) 검사**

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```js
// eslint.config.js
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'jsx-a11y/alt-text': 'error', // img 태그 alt 필수
      'jsx-a11y/aria-props': 'error', // 올바른 ARIA 속성
      'jsx-a11y/anchor-is-valid': 'error', // 유효한 링크
    },
  },
];
```

웹 접근성은 포트폴리오에서 중요한 차별화 요소입니다. 이 설정으로 자동 검증하면 접근성 표준을
자연스럽게 학습할 수 있습니다.

#### 2. **Import 경로 검증**

```bash
npm install --save-dev eslint-import-resolver-typescript
```

```js
settings: {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: './tsconfig.json',
    },
  },
}
```

TypeScript path mapping(`@/*`)을 ESLint가 정확히 인식하도록 설정합니다.

#### 3. **성능 최적화 힌트**

```js
'react/jsx-no-bind': 'warn', // render 내 함수 생성 경고
'react/jsx-key': 'error', // 리스트 key 필수
'react/no-array-index-key': 'warn', // index를 key로 사용 경고
```

이러한 규칙은 React 성능 최적화 베스트 프랙티스를 강제하여 자연스럽게 좋은 코드를 작성하게 만듭니다.

---

## 트러블슈팅

### ❓ 자주 발생하는 문제

#### 1. **ESLint와 Prettier 충돌**

**증상:** Prettier로 포맷팅하면 ESLint 에러 발생

**해결:**

```bash
npm install --save-dev eslint-config-prettier
```

```js
// eslint.config.js
import prettier from 'eslint-config-prettier';

export default [
  // ...다른 설정
  prettier, // 마지막에 추가하여 충돌 규칙 비활성화
];
```

`eslint-config-prettier`는 Prettier와 충돌하는 모든 ESLint 규칙을 자동으로 꺼주므로 반드시 설정
배열의 마지막에 위치해야 합니다.

#### 2. **Import 순서가 자동으로 정렬되지 않음**

**확인 사항:**

```bash
# Prettier plugin 설치 여부 확인
npm list @trivago/prettier-plugin-sort-imports
```

**해결:**

- VSCode를 완전히 재시작 (Prettier plugin 변경 시 필수)
- `.prettierrc` 파일이 루트에 있는지 확인
- VSCode 설정에서 기본 포맷터가 Prettier인지 확인

#### 3. **절대 경로 import가 인식되지 않음**

**tsconfig.json 확인:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**ESLint 설정 확인:**

```js
settings: {
  'import/resolver': {
    typescript: true,
  },
}
```

두 설정이 모두 일치해야 절대 경로가 정상 작동합니다.

---

## 핵심 개념 정리

### ESLint vs Prettier 역할 구분

**ESLint (코드 품질)**

- 잠재적 버그 감지
- 코드 로직 검증
- 베스트 프랙티스 강제
- 예: 사용하지 않는 변수, 잘못된 Hook 사용 등

**Prettier (코드 포맷팅)**

- 일관된 코드 스타일
- 들여쓰기, 따옴표, 줄바꿈 등
- 자동 정렬 및 정리
- 예: import 순서, 세미콜론, printWidth 등

이 둘을 함께 사용하면 코드 품질과 가독성을 동시에 확보할 수 있습니다.

### FSD 아키텍처와 린팅의 관계

FSD에서 레이어 간 import 제한은 단순한 규칙이 아니라 **아키텍처를 코드 레벨에서 강제하는 핵심
메커니즘**입니다.

```
app → pages → widgets → features → entities → shared
      (상위)                                  (하위)

하위 레이어는 상위 레이어를 절대 import 불가
```

이 규칙을 ESLint로 강제하면:

- 수동 코드 리뷰 부담 감소
- 신규 팀원도 아키텍처 자동 준수
- 리팩토링 시 의존성 관리 용이

---

## 다음 단계

### 학습 로드맵

이제 ESLint/Prettier 설정의 "왜"와 "어떻게"를 이해했다면:

1. **[폴더 구조 가이드](./02-folder-structure-guide.md)** - FSD 아키텍처 실전 적용
2. **[네이밍 컨벤션](./03-naming-convention-guide.md)** - 일관된 코드 작성
3. **[Git 워크플로우](./04-git-workflow-guide.md)** - 팀 협업 전략

각 가이드를 순서대로 학습하면 엔터프라이즈급 프로젝트 구조를 완성할 수 있습니다.

---

## 참고 자료

- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [React Hook Rules](https://react.dev/reference/react/hooks#rules-of-hooks)
