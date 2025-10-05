# 테스트 전략 가이드

> 안정적인 코드를 위한 테스트

## 📋 목차

- [테스트 피라미드](#테스트-피라미드)
- [Unit 테스트](#unit-테스트)
- [Integration 테스트](#integration-테스트)
- [E2E 테스트](#e2e-테스트)
- [테스트 작성 전략](#테스트-작성-전략)

---

## 테스트 피라미드

### 테스트 종류와 비율

```
        /\
       /  \  E2E (10%)
      /----\
     /      \ Integration (30%)
    /--------\
   /          \ Unit (60%)
  /-----------­-\
```

**Unit 테스트 (60%):**

- 개별 함수/컴포넌트 테스트
- 빠르고 많이 작성
- 격리된 환경

**Integration 테스트 (30%):**

- 여러 모듈 통합 테스트
- API 연동, 상태 관리
- 실제 동작 흐름 검증

**E2E 테스트 (10%):**

- 사용자 시나리오 테스트
- 전체 앱 동작 검증
- 느리지만 확실한 검증

---

## Unit 테스트

### 1. 설정 (Vitest)

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react jsdom
```

**`vitest.config.ts`:**

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

**`vitest.setup.ts`:**

```ts
import '@testing-library/jest-dom';
```

**`package.json`:**

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 2. 유틸 함수 테스트

```ts
// shared/lib/formatCurrency.test.ts
import { describe, expect, it } from 'vitest';

import { formatCurrency } from './formatCurrency';

// shared/lib/formatCurrency.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

describe('formatCurrency', () => {
  it('should format number to Korean currency', () => {
    expect(formatCurrency(10000)).toBe('₩10,000');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('₩0');
  });

  it('should handle negative numbers', () => {
    expect(formatCurrency(-5000)).toBe('-₩5,000');
  });

  it('should handle decimals', () => {
    expect(formatCurrency(1234.56)).toBe('₩1,235'); // 반올림
  });
});
```

### 3. React 컴포넌트 테스트

```tsx
// shared/ui/Button/Button.test.tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

// shared/ui/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export function Button({ variant = 'primary', onClick, children, disabled }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

describe('Button', () => {
  it('should render children', () => {
    render(<Button onClick={() => {}}>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply variant class', () => {
    render(
      <Button variant='secondary' onClick={() => {}}>
        Button
      </Button>
    );
    const button = screen.getByText('Button');
    expect(button).toHaveClass('btn-secondary');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <Button onClick={() => {}} disabled>
        Button
      </Button>
    );
    const button = screen.getByText('Button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Button
      </Button>
    );

    fireEvent.click(screen.getByText('Button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### 4. 커스텀 Hook 테스트

```ts
// features/auth/model/useAuth.ts
import { useState } from 'react';

import { act, renderHook, waitFor } from '@testing-library/react';
// features/auth/model/useAuth.test.ts
import { describe, expect, it, vi } from 'vitest';

import { useAuth } from './useAuth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginAPI({ email, password });
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return { user, isLoading, login, logout };
}

// API 모킹
vi.mock('@/shared/api/auth', () => ({
  loginAPI: vi.fn(() => Promise.resolve({ id: '1', name: 'John' })),
}));

describe('useAuth', () => {
  it('should initialize with null user', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual({ id: '1', name: 'John' });
    expect(result.current.isLoading).toBe(false);
  });

  it('should show loading state during login', async () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login('test@example.com', 'password');
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should logout', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});
```

---

## Integration 테스트

### 1. API + 상태 관리 통합

```tsx
// features/product/model/useProducts.ts
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '@/entities/product/api';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: productAPI.fetchList,
  });
}

// features/product/model/useProducts.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './useProducts';
import * as productAPI from '@/entities/product/api';

// API 모킹
vi.mock('@/entities/product/api', () => ({
  productAPI: {
    fetchList: vi.fn(),
  },
}));

describe('useProducts Integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('should fetch products successfully', async () => {
    const mockProducts = [
      { id: '1', name: 'Product 1', price: 10000 },
      { id: '2', name: 'Product 2', price: 20000 },
    ];

    vi.mocked(productAPI.productAPI.fetchList).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProducts);
  });

  it('should handle API error', async () => {
    vi.mocked(productAPI.productAPI.fetchList).mockRejectedValue(
      new Error('API Error')
    );

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});
```

### 2. 폼 제출 플로우 테스트

```tsx
// features/auth/login/ui/LoginForm.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import * as authAPI from '@/shared/api/auth';

import { LoginForm } from './LoginForm';

// features/auth/login/ui/LoginForm.tsx
export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='이메일'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='비밀번호'
      />
      <button type='submit'>로그인</button>
    </form>
  );
}

vi.mock('@/shared/api/auth');

describe('LoginForm Integration', () => {
  it('should submit login form', async () => {
    const user = userEvent.setup();
    const mockLogin = vi.fn().mockResolvedValue({ id: '1', name: 'John' });
    vi.mocked(authAPI.loginAPI).mockImplementation(mockLogin);

    render(<LoginForm />);

    // 이메일 입력
    const emailInput = screen.getByPlaceholderText('이메일');
    await user.type(emailInput, 'test@example.com');

    // 비밀번호 입력
    const passwordInput = screen.getByPlaceholderText('비밀번호');
    await user.type(passwordInput, 'password123');

    // 제출
    const submitButton = screen.getByText('로그인');
    await user.click(submitButton);

    // API 호출 확인
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

---

## E2E 테스트

### 1. Playwright 설정

```bash
npm init playwright@latest
```

**`playwright.config.ts`:**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2. 사용자 시나리오 테스트

```ts
// e2e/login.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    // 로그인 페이지 이동
    await page.goto('/login');

    // 폼 입력
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // 로그인 버튼 클릭
    await page.click('button:has-text("로그인")');

    // 대시보드로 리다이렉트 확인
    await expect(page).toHaveURL('/dashboard');

    // 사용자 이름 표시 확인
    await expect(page.locator('text=John')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("로그인")');

    // 에러 메시지 확인
    await expect(page.locator('text=로그인 실패')).toBeVisible();

    // 여전히 로그인 페이지
    await expect(page).toHaveURL('/login');
  });
});
```

### 3. 장바구니 플로우 테스트

```ts
// e2e/cart.spec.ts
import { expect, test } from '@playwright/test';

test.describe('Shopping Cart', () => {
  test('should add item to cart', async ({ page }) => {
    // 상품 목록 페이지
    await page.goto('/products');

    // 첫 번째 상품 클릭
    await page.click('[data-testid="product-card"]:first-child');

    // 상품 상세 페이지
    await expect(page.locator('h1')).toContainText('상품');

    // 장바구니 추가
    await page.click('button:has-text("장바구니 추가")');

    // 알림 확인
    await expect(page.locator('text=장바구니에 추가되었습니다')).toBeVisible();

    // 장바구니 페이지 이동
    await page.click('[data-testid="cart-icon"]');

    // 상품이 장바구니에 있는지 확인
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
  });
});
```

### 4. 시각적 회귀 테스트

```ts
// e2e/visual.spec.ts
import { expect, test } from '@playwright/test';

test('homepage visual regression', async ({ page }) => {
  await page.goto('/');

  // 전체 페이지 스크린샷
  await expect(page).toHaveScreenshot('homepage.png');

  // 특정 요소 스크린샷
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png');
});
```

---

## 테스트 작성 전략

### 1. AAA 패턴

```ts
describe('formatCurrency', () => {
  it('should format number to currency', () => {
    // Arrange (준비)
    const amount = 10000;

    // Act (실행)
    const result = formatCurrency(amount);

    // Assert (검증)
    expect(result).toBe('₩10,000');
  });
});
```

### 2. 테스트 더블

**Stub (미리 정의된 응답):**

```ts
vi.mocked(fetchUser).mockResolvedValue({ id: '1', name: 'John' });
```

**Spy (호출 추적):**

```ts
const spy = vi.spyOn(console, 'error');
// ... 실행
expect(spy).toHaveBeenCalledWith('Error message');
```

**Mock (전체 모듈 교체):**

```ts
vi.mock('@/shared/api/auth', () => ({
  loginAPI: vi.fn(),
}));
```

### 3. 테스트 커버리지 목표

```json
// package.json
{
  "scripts": {
    "test:coverage": "vitest --coverage"
  }
}
```

**목표:**

- 전체: 80% 이상
- 중요 비즈니스 로직: 90% 이상
- UI 컴포넌트: 70% 이상

### 4. 무엇을 테스트할까?

**✅ 테스트해야 할 것:**

- 비즈니스 로직 (계산, 검증)
- 상태 변화 (store, useState)
- API 연동
- 엣지 케이스 (빈 값, 에러)
- 사용자 플로우 (E2E)

**❌ 테스트하지 않아도 될 것:**

- 라이브러리 내부 로직
- 단순 JSX 렌더링만 하는 컴포넌트
- 스타일 (visual regression으로 대체)

### 5. 테스트 네이밍

```ts
describe('ProductCard', () => {
  // ✅ 명확한 테스트명
  it('should display product name and price', () => {});
  it('should call onAddToCart when button is clicked', () => {});
  it('should show sale badge when product is on sale', () => {});

  // ❌ 모호한 테스트명
  it('works', () => {});
  it('test1', () => {});
});
```

**패턴:**

- `should [expected behavior] when [condition]`
- `should [expected behavior]`

---

## 실전 예제: TDD로 기능 개발

### 시나리오: 할인 계산 함수

#### 1단계: 테스트 작성 (실패)

```ts
// shared/lib/calculateDiscount.test.ts
describe('calculateDiscount', () => {
  it('should calculate 10% discount', () => {
    const result = calculateDiscount(10000, 10);
    expect(result).toBe(9000);
  });
});
```

#### 2단계: 최소 구현 (통과)

```ts
// shared/lib/calculateDiscount.ts
export function calculateDiscount(price: number, discountPercent: number): number {
  return price - (price * discountPercent) / 100;
}
```

#### 3단계: 엣지 케이스 추가

```ts
describe('calculateDiscount', () => {
  it('should calculate 10% discount', () => {
    expect(calculateDiscount(10000, 10)).toBe(9000);
  });

  it('should handle 0% discount', () => {
    expect(calculateDiscount(10000, 0)).toBe(10000);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(10000, 100)).toBe(0);
  });

  it('should throw error for negative discount', () => {
    expect(() => calculateDiscount(10000, -10)).toThrow();
  });
});
```

#### 4단계: 리팩토링

```ts
export function calculateDiscount(price: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percent must be between 0 and 100');
  }

  const discount = (price * discountPercent) / 100;
  return Math.max(0, price - discount);
}
```

---

## 테스트 체크리스트

### Unit 테스트

- [ ] 유틸 함수에 엣지 케이스 테스트
- [ ] React 컴포넌트 렌더링 테스트
- [ ] 사용자 상호작용 테스트 (클릭, 입력)
- [ ] 커스텀 Hook 테스트

### Integration 테스트

- [ ] API + 상태 관리 통합 테스트
- [ ] 폼 제출 플로우 테스트
- [ ] 에러 핸들링 테스트

### E2E 테스트

- [ ] 핵심 사용자 시나리오 테스트
- [ ] 인증 플로우 테스트
- [ ] 주요 기능 플로우 테스트

### 일반

- [ ] 테스트 커버리지 80% 이상
- [ ] CI/CD에 테스트 통합
- [ ] 테스트 이름이 명확함
- [ ] AAA 패턴 준수

---

## 다음 단계

1. **[트러블슈팅](./08-troubleshooting-guide.md)** - 문제 해결 가이드

---

## 참고 자료

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright](https://playwright.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
