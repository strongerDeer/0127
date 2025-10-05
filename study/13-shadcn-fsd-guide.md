# shadcn/ui + FSD 아키텍처 가이드

## 📋 목차

1. [폴더 구조 설계](#폴더-구조-설계)
2. [shadcn 설정](#shadcn-설정)
3. [lint/prettier 설정](#lintprettier-설정)
4. [실전 사용법](#실전-사용법)

---

## 🏗️ 폴더 구조 설계

### 최종 구조

```
src/
├── shadcn/              # shadcn 전용 (외부 라이브러리, lint 제외)
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── lib/
│       └── utils.ts     # cn() 유틸 함수
│
├── app/                 # Next.js App Router
├── pages/               # 페이지 컴포넌트
├── widgets/             # 독립 블록 (Header, Footer)
├── features/            # 사용자 시나리오 (인증, 댓글 등)
├── entities/            # 비즈니스 엔티티 (User, Post)
└── shared/              # 프로젝트 공통 코드
    ├── ui/              # 커스텀 UI 컴포넌트
    │   ├── Icon.tsx
    │   └── Logo.tsx
    ├── lib/             # 유틸리티 함수
    └── api/             # API 클라이언트
```

### 설계 원칙

**shadcn 분리 이유:**

- shadcn은 외부 라이브러리 (FSD 구조 외부)
- lint/prettier 제외 필요
- 자동 생성 파일이므로 별도 관리

**shared/ui vs shadcn/ui:**

- `shadcn/ui` - shadcn이 생성한 컴포넌트
- `shared/ui` - 프로젝트에서 직접 만든 컴포넌트

---

## ⚙️ shadcn 설정

### 1. 초기 설정

```bash
npx shadcn@latest init
```

**설치 옵션:**

- Style: New York
- Color: Neutral
- CSS Variables: Yes

### 2. components.json 설정

```json
{
  "aliases": {
    "components": "@/shadcn",
    "utils": "@/shadcn/lib/utils",
    "ui": "@/shadcn/ui",
    "lib": "@/shadcn/lib",
    "hooks": "@/shadcn/hooks"
  }
}
```

### 3. 컴포넌트 추가

```bash
# Button 컴포넌트 추가
npx shadcn@latest add button

# 결과: src/shadcn/ui/button.tsx 생성
```

---

## 🔧 lint/prettier 설정

### ESLint 제외

**`eslint.config.mjs`:**

```js
export default [
  {
    ignores: [
      '.next/**/*',
      'next-env.d.ts',
      'src/shadcn/**/*', // shadcn 제외
      'node_modules/**/*',
      '**/*.config.{js,ts}',
      'public/**/*',
    ],
  },
  // ... 나머지 설정
];
```

### Prettier 제외

**`.prettierignore`:**

```
# shadcn 컴포넌트 제외
src/shadcn/**/*

# 빌드 폴더 제외
.next/
node_modules/
```

---

## 💡 실전 사용법

### 1. shadcn 컴포넌트 사용

```tsx
// features/auth/ui/LoginButton.tsx
import { Button } from '@/shadcn/ui/button';

import { LogIn } from 'lucide-react';

export function LoginButton() {
  return (
    <Button size='lg' className='gap-2'>
      <LogIn className='h-5 w-5' />
      로그인
    </Button>
  );
}
```

### 2. cn() 유틸 함수 사용

```tsx
import { cn } from '@/shadcn/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)}>
```

### 3. 커스텀 컴포넌트 만들기

**`shared/ui/Icon.tsx`:**

```tsx
import { memo } from 'react';

import { LucideIcon, LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  icon: LucideIcon;
}

const Icon = ({ icon: IconComponent, ...props }: IconProps) => {
  return <IconComponent {...props} />;
};

export default memo(Icon);
```

**사용:**

```tsx
import { Home } from 'lucide-react';

import Icon from '@/shared/ui/Icon';

<Icon icon={Home} size={24} />;
```

---

## 🎨 아이콘 사용 가이드

### lucide-react (추천)

shadcn과 함께 사용하는 아이콘 라이브러리

**장점:**

- ✅ 트리 쉐이킹 (사용한 아이콘만 번들)
- ✅ 타입 안전성 100%
- ✅ shadcn 공식 지원

**사용법:**

```tsx
import { Home, User, Settings } from 'lucide-react';

<Home className='h-6 w-6' />
<User size={24} />
<Settings className='text-blue-500' />
```

### @iconify/react (비추천)

- ❌ 런타임에 아이콘 로드 (네트워크 요청)
- ❌ 번들 크기 증가
- ⚠️ shadcn과 함께 쓸 이유 없음

---

## 📝 FSD 레이어별 사용 예시

### features (기능)

```tsx
// features/auth/ui/LoginButton.tsx
import { Button } from '@/shadcn/ui/button';

import { LogIn } from 'lucide-react';

import { useAuth } from '../model/useAuth';

export function LoginButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button onClick={signInWithGoogle}>
      <LogIn /> 로그인
    </Button>
  );
}
```

### widgets (위젯)

```tsx
// widgets/Header/ui/Header.tsx
import { Button } from '@/shadcn/ui/button';

import Logo from '@/shared/ui/Logo';

export function Header() {
  return (
    <header>
      <Logo />
      <nav>
        <Button variant='ghost'>Home</Button>
      </nav>
    </header>
  );
}
```

### shared (공통)

```tsx
// shared/ui/Card.tsx - 커스텀 컴포넌트
import { cn } from '@/shadcn/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <div className={cn('rounded-lg border p-4', className)}>{children}</div>;
}
```

---

## 🚨 주의사항

### 1. shadcn 파일 직접 수정 금지

```tsx
// ❌ 나쁜 예: shadcn/ui/button.tsx 직접 수정
// src/shadcn/ui/button.tsx
export const Button = () => {
  // 커스텀 로직 추가 X
}

// ✅ 좋은 예: 별도 컴포넌트로 래핑
// shared/ui/PrimaryButton.tsx
import { Button } from '@/shadcn/ui/button';

export function PrimaryButton(props) {
  return <Button variant='default' {...props} />;
}
```

### 2. Import 순서

Prettier가 자동 정렬:

```tsx
// 1. 외부 라이브러리
// 2. shadcn
import { Button } from '@/shadcn/ui/button';

import { useState } from 'react';

import { LogIn } from 'lucide-react';

// 3. 프로젝트 내부 (FSD 순서)
import { useAuth } from '@/features/auth/model/useAuth';
```

### 3. 타입 안전성

```tsx
// ✅ shadcn 컴포넌트 Props 타입 활용
import { ButtonProps } from '@/shadcn/ui/button';

interface MyButtonProps extends ButtonProps {
  loading?: boolean;
}
```

---

## 🔄 마이그레이션 가이드

### 기존 components/ui → shadcn

```bash
# 1. 폴더 생성
mkdir -p src/shadcn/ui src/shadcn/lib

# 2. 파일 이동
mv src/components/ui/* src/shadcn/ui/
mv src/lib/utils.ts src/shadcn/lib/

# 3. components.json 수정
{
  "aliases": {
    "ui": "@/shadcn/ui"
  }
}

# 4. import 경로 수정
# Before: '@/components/ui/button'
# After:  '@/shadcn/ui/button'
```

---

## ✅ 체크리스트

### 초기 설정

- [ ] shadcn 설치 및 초기화
- [ ] components.json 경로 설정
- [ ] ESLint/Prettier 제외 설정

### 컴포넌트 추가 시

- [ ] `npx shadcn add {컴포넌트명}` 실행
- [ ] `src/shadcn/ui/` 에 생성 확인
- [ ] Import 경로: `@/shadcn/ui/{컴포넌트명}`

### 커스텀 컴포넌트

- [ ] `shared/ui/` 에 생성
- [ ] shadcn 컴포넌트 재사용
- [ ] FSD 레이어 규칙 준수

---

## 🔗 참고 자료

- [shadcn/ui 공식 문서](https://ui.shadcn.com)
- [lucide-react 아이콘](https://lucide.dev)
- [FSD 아키텍처](https://feature-sliced.design)
