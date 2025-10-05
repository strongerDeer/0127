# 폴더 구조 가이드 (FSD 아키텍처)

> Feature-Sliced Design: 확장 가능한 프론트엔드 아키텍처

## 📋 목차

- [FSD 아키텍처 개요](#fsd-아키텍처-개요)
- [레이어별 상세 설명](#레이어별-상세-설명)
- [실전 예제](#실전-예제)
- [폴더 네이밍 전략](#폴더-네이밍-전략)
- [안티 패턴과 해결책](#안티-패턴과-해결책)

---

## FSD 아키텍처 개요

### 🎯 왜 FSD인가?

일반적인 프론트엔드 프로젝트는 시간이 지나면서 이런 문제에 직면합니다:

```
components/
├── Button.tsx
├── UserProfile.tsx
├── ProductCard.tsx
├── CartButton.tsx
├── LoginForm.tsx
├── AdminDashboard.tsx
└── ... (100+ 파일들이 한 폴더에)
```

**문제점:**

- 파일이 많아지면 찾기 어려움
- 컴포넌트 간 의존성 파악 불가
- 비즈니스 로직과 UI가 섞임
- 팀원마다 다른 구조로 코드 작성

**FSD의 해결책:**

- 기능별 격리 (Feature-Sliced)
- 명확한 의존성 방향
- 예측 가능한 구조
- 확장 가능한 설계

### 📊 FSD 레이어 구조

```
src/
├── app/              # 앱 초기화 및 전역 설정
├── pages/            # 라우트별 페이지 조합
├── widgets/          # 독립적인 UI 블록 (Header, Footer)
├── features/         # 사용자 시나리오 (Login, AddToCart)
├── entities/         # 비즈니스 엔티티 (User, Product)
└── shared/           # 공통 유틸/UI
```

**의존성 규칙 (상위 → 하위만 가능):**

```
app → pages → widgets → features → entities → shared
```

이 규칙을 ESLint로 강제하면 순환 참조가 원천 차단됩니다.

---

## 레이어별 상세 설명

### 1. `shared/` - 공통 인프라

**역할:** 프로젝트 전체에서 사용하는 재사용 가능한 코드

```
shared/
├── ui/              # 순수 UI 컴포넌트 (Button, Input)
├── lib/             # 유틸 함수 (formatDate, debounce)
├── api/             # API 클라이언트 설정
├── config/          # 환경 설정
└── types/           # 공통 타입 정의
```

**예제:**

```tsx
// shared/ui/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

export const Button = ({ variant, onClick, children }: ButtonProps) => {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

**핵심 원칙:**

- 비즈니스 로직 없음 (순수 UI/유틸만)
- 다른 레이어 import 금지
- 프로젝트가 바뀌어도 재사용 가능한 수준

### 2. `entities/` - 비즈니스 엔티티

**역할:** 도메인의 핵심 개념 (User, Product, Order 등)

```
entities/
├── user/
│   ├── model/       # 상태 관리 (Zustand store)
│   ├── api/         # User 관련 API
│   ├── ui/          # User 관련 UI (UserCard, UserAvatar)
│   └── lib/         # User 관련 유틸
└── product/
    ├── model/
    ├── api/
    └── ui/
```

**예제:**

```tsx
// entities/user/model/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

```tsx
// entities/user/ui/UserCard.tsx
import { User } from '../model/types';

export const UserCard = ({ user }: { user: User }) => {
  return (
    <div className='user-card'>
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
    </div>
  );
};
```

**핵심 원칙:**

- 순수한 도메인 로직만 포함
- features/widgets/pages import 금지
- shared와 다른 entities만 import 가능

### 3. `features/` - 사용자 시나리오

**역할:** 사용자가 수행하는 구체적인 액션

```
features/
├── auth/
│   ├── login/
│   │   ├── ui/          # 로그인 폼
│   │   └── model/       # 로그인 로직
│   └── logout/
├── cart/
│   ├── add-to-cart/
│   └── remove-from-cart/
└── review/
    └── write-review/
```

**예제:**

```tsx
// features/auth/login/ui/LoginForm.tsx
import { useState } from 'react';

import { useUserStore } from '@/entities/user';

import { Button } from '@/shared/ui';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    const user = await loginAPI(email);
    setUser(user);
  };

  return (
    <form>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button variant='primary' onClick={handleLogin}>
        로그인
      </Button>
    </form>
  );
};
```

**핵심 원칙:**

- 하나의 명확한 사용자 액션
- entities와 shared만 import
- widgets/pages import 금지

### 4. `widgets/` - 독립적인 UI 블록

**역할:** 여러 features를 조합한 큰 UI 단위

```
widgets/
├── header/
│   └── ui/Header.tsx
├── footer/
│   └── ui/Footer.tsx
└── user-profile/
    └── ui/UserProfile.tsx
```

**예제:**

```tsx
// widgets/header/ui/Header.tsx
import { UserAvatar } from '@/entities/user';
import { useUserStore } from '@/entities/user';

import { LoginForm } from '@/features/auth/login';
import { LogoutButton } from '@/features/auth/logout';

export const Header = () => {
  const user = useUserStore((state) => state.user);

  return (
    <header>
      <nav>
        {user ? (
          <>
            <UserAvatar user={user} />
            <LogoutButton />
          </>
        ) : (
          <LoginForm />
        )}
      </nav>
    </header>
  );
};
```

**핵심 원칙:**

- 여러 features 조합 가능
- pages import 금지
- 페이지 독립적으로 재사용 가능

### 5. `pages/` - 라우트별 페이지

**역할:** URL에 매핑되는 페이지 컴포넌트

```
pages/
├── home/
│   └── ui/HomePage.tsx
├── product/
│   └── ui/ProductPage.tsx
└── profile/
    └── ui/ProfilePage.tsx
```

**예제 (App Router):**

```tsx
// app/(main)/page.tsx
import { HomePage } from '@/pages/home';

export default function Page() {
  return <HomePage />;
}
```

```tsx
// pages/home/ui/HomePage.tsx
import { Footer } from '@/widgets/footer';
import { Header } from '@/widgets/header';
import { ProductList } from '@/widgets/product-list';

export const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <ProductList />
      </main>
      <Footer />
    </>
  );
};
```

**핵심 원칙:**

- 모든 레이어 import 가능
- 비즈니스 로직 최소화 (조합만)
- URL 구조와 폴더 구조 일치

### 6. `app/` - 앱 초기화

**역할:** 전역 설정 및 프로바이더

```
app/
├── providers/       # 전역 Provider
├── styles/          # 전역 스타일
└── layout.tsx       # Root Layout
```

**예제:**

```tsx
// app/providers/Providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

---

## 실전 예제

### 시나리오: 북마크 기능 추가

#### 1단계: entities에 도메인 추가

```tsx
// entities/bookmark/model/types.ts
export interface Bookmark {
  id: string;
  productId: string;
  userId: string;
  createdAt: Date;
}
```

```tsx
// entities/bookmark/api/bookmarkApi.ts
export const bookmarkAPI = {
  add: async (productId: string) => {
    return await fetch('/api/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
};
```

#### 2단계: features에 액션 추가

```tsx
// features/bookmark/add-bookmark/ui/AddBookmarkButton.tsx
import { bookmarkAPI } from '@/entities/bookmark';

import { Button } from '@/shared/ui';

export const AddBookmarkButton = ({ productId }: { productId: string }) => {
  const handleAdd = () => {
    bookmarkAPI.add(productId);
  };

  return (
    <Button variant='secondary' onClick={handleAdd}>
      북마크 추가
    </Button>
  );
};
```

#### 3단계: widgets에서 조합

```tsx
// widgets/product-card/ui/ProductCard.tsx
import { ProductImage } from '@/entities/product';

import { AddBookmarkButton } from '@/features/bookmark/add-bookmark';

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div>
      <ProductImage src={product.image} />
      <h3>{product.name}</h3>
      <AddBookmarkButton productId={product.id} />
    </div>
  );
};
```

#### 4단계: pages에서 사용

```tsx
// pages/shop/ui/ShopPage.tsx
import { ProductCard } from '@/widgets/product-card';

export const ShopPage = () => {
  const products = useProducts();

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

---

## 폴더 네이밍 전략

### 1. Segment (세그먼트)

각 레이어 내부의 모듈 단위를 "세그먼트"라고 부릅니다.

```
features/
└── auth/              # Segment 이름: auth
    ├── login/         # Slice 이름: login
    └── logout/
```

**네이밍 규칙:**

- kebab-case 사용 (`add-to-cart`, `user-profile`)
- 동사형 (features) vs 명사형 (entities)
- 3단어 이하로 간결하게

### 2. Slice (슬라이스)

구체적인 기능 단위

```
features/cart/
├── add-to-cart/       ✅ 동사 + 명사
├── remove-from-cart/  ✅ 명확한 액션
└── update-quantity/   ✅ 구체적
```

**안티 패턴:**

```
features/cart/
├── cart/              ❌ 세그먼트 이름 중복
├── utils/             ❌ 모호함
└── components/        ❌ 기술적 분류
```

### 3. Public API (index.ts)

각 모듈은 `index.ts`로 외부에 공개할 것만 export

```tsx
// features/auth/login/index.ts
export { LoginForm } from './ui/LoginForm';
export { useLoginMutation } from './model/useLoginMutation';
```

**사용:**

```tsx
// ✅ Public API 사용
import { LoginForm } from '@/features/auth/login';

// ❌ 내부 구현 직접 접근 금지
import { LoginForm } from '@/features/auth/login/ui/LoginForm';
```

이렇게 하면 내부 구현을 자유롭게 리팩토링할 수 있습니다.

---

## 안티 패턴과 해결책

### 1. ❌ 모든 것을 shared에 넣기

**문제:**

```
shared/
├── components/
│   ├── UserCard.tsx      # entities/user/ui로
│   ├── ProductList.tsx   # widgets/product-list로
│   └── LoginForm.tsx     # features/auth/login으로
```

**해결:**

- shared는 프로젝트 독립적인 것만
- 도메인 관련은 entities/features로

### 2. ❌ features에서 widgets import

**문제:**

```tsx
// features/auth/login/ui/LoginForm.tsx
import { Header } from '@/widgets/header';

// ❌ 상위 레이어 import
```

**해결:**

- features는 entities와 shared만 사용
- 조합은 widgets/pages에서

### 3. ❌ 깊은 중첩 구조

**문제:**

```
features/
└── e-commerce/
    └── product/
        └── cart/
            └── add-to-cart/   # 너무 깊음
```

**해결:**

```
features/
└── cart/
    └── add-to-cart/           # 플랫하게
```

FSD는 최대 3-4 depth를 권장합니다.

### 4. ❌ 기술적 분류

**문제:**

```
features/
└── user/
    ├── components/    # 기술적 분류
    ├── hooks/
    └── utils/
```

**해결:**

```
features/
└── user/
    ├── edit-profile/  # 기능별 분류
    └── delete-account/
```

기술이 아닌 비즈니스 가치 중심으로 구성합니다.

---

## Dot 폴더 네이밍 (선택사항)

일부 팀에서는 깊은 중첩 대신 dot을 사용합니다:

```
features/
├── cart.add-to-cart/
├── cart.remove-from-cart/
└── cart.update-quantity/
```

**장점:**

- 폴더 깊이 감소
- IDE에서 그룹화 용이
- import 경로 짧아짐

**단점:**

- 비표준 (FSD 공식 아님)
- 도구 호환성 문제 가능

**권장:** 프로젝트 초기에는 표준 구조 사용, 필요시 점진적 전환

---

## 마이그레이션 전략

### 기존 프로젝트 → FSD 전환

#### 1단계: shared 분리

```
기존:
components/Button.tsx

FSD:
shared/ui/Button/
```

#### 2단계: entities 추출

```
기존:
components/UserCard.tsx

FSD:
entities/user/ui/UserCard/
```

#### 3단계: features 분리

```
기존:
components/LoginForm.tsx

FSD:
features/auth/login/ui/LoginForm.tsx
```

#### 4단계: ESLint 규칙 활성화

레이어별 import 제한을 점진적으로 강화합니다.

---

## 핵심 원칙 정리

### 의존성 방향

```
하위 레이어는 상위를 모름
상위 레이어는 하위를 조합함
```

### 변경의 영향 범위

- shared 변경 → 전체 영향
- entities 변경 → features 이상 영향
- features 변경 → widgets/pages 영향
- pages 변경 → 해당 페이지만 영향

이 구조로 리팩토링 시 영향 범위를 정확히 예측할 수 있습니다.

### 확장 전략

프로젝트가 성장하면:

1. 새 기능 → features에 추가
2. 공통 패턴 발견 → entities로 추상화
3. 큰 UI 블록 → widgets로 분리
4. 라우트 추가 → pages에 조합

FSD는 이런 확장을 자연스럽게 지원합니다.

---

## 실무 팁

### VSCode Snippet 활용

```json
// .vscode/fsd-feature.code-snippets
{
  "FSD Feature": {
    "scope": "typescriptreact",
    "prefix": "fsd-feature",
    "body": [
      "export const ${1:FeatureName} = () => {",
      "  return <div>${1:FeatureName}</div>;",
      "};"
    ]
  }
}
```

### 폴더 템플릿 CLI

```bash
# scripts/create-feature.sh
mkdir -p features/$1/ui
mkdir -p features/$1/model
touch features/$1/index.ts
```

사용:

```bash
./scripts/create-feature.sh add-to-cart
```

---

## 다음 단계

1. **[네이밍 컨벤션](./03-naming-convention-guide.md)** - 일관된 이름 짓기
2. **[Git 워크플로우](./04-git-workflow-guide.md)** - 협업 전략
3. **[성능 최적화](./05-performance-guide.md)** - 실전 최적화 기법

---

## 참고 자료

- [FSD 공식 문서](https://feature-sliced.design/)
- [FSD GitHub](https://github.com/feature-sliced/documentation)
- [예제 프로젝트](https://github.com/feature-sliced/examples)
