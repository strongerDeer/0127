# 네이밍 컨벤션 가이드

> 일관된 코드 작성을 위한 명명 규칙

## 📋 목차

- [기본 원칙](#기본-원칙)
- [파일 및 폴더 네이밍](#파일-및-폴더-네이밍)
- [변수 및 함수 네이밍](#변수-및-함수-네이밍)
- [React 컴포넌트 네이밍](#react-컴포넌트-네이밍)
- [TypeScript 타입 네이밍](#typescript-타입-네이밍)
- [실무 예제](#실무-예제)

---

## 기본 원칙

### 1. 명확성 > 간결성

```tsx
// ❌ 모호함
const data = fetchData();
const res = await api();
const temp = calculate();

// ✅ 명확함
const userData = fetchUserData();
const productResponse = await productAPI.getList();
const totalPrice = calculateTotalPrice();
```

**핵심:** 변수명만 보고도 무엇을 의미하는지 알 수 있어야 합니다.

### 2. 일관성 유지

같은 개념은 프로젝트 전체에서 동일한 용어를 사용합니다.

```tsx
// ❌ 일관성 없음
function getUser() {}
function fetchProduct() {}
function retrieveOrder() {}

// ✅ 일관성 있음
function fetchUser() {}
function fetchProduct() {}
function fetchOrder() {}
```

### 3. 문맥에 맞는 길이

```tsx
// ✅ 짧은 스코프
array.map((item) => item.id);
array.filter((x) => x > 0);

// ✅ 긴 스코프
function processUserAuthentication(userCredentials: UserCredentials) {
  const isValidCredentials = validateCredentials(userCredentials);
  // ...
}
```

**규칙:**

- 반복문/콜백: 1-2글자 (i, idx, item, x)
- 함수/변수: 2-4단어
- 클래스/타입: 1-3단어

---

## 파일 및 폴더 네이밍

### 1. 컴포넌트 파일

**PascalCase + 확장자**

```
✅ Button.tsx
✅ UserProfile.tsx
✅ ProductCard.tsx

❌ button.tsx
❌ user-profile.tsx
❌ product_card.tsx
```

**이유:**

- JSX/TSX는 컴포넌트 중심
- import 시 컴포넌트명과 파일명 일치
- 일반 유틸 파일과 구분 용이

### 2. Hook 파일

**camelCase + use 접두사**

```
✅ useAuth.ts
✅ useProduct.ts
✅ useLocalStorage.ts

❌ authHook.ts
❌ UseAuth.ts
❌ use-auth.ts
```

### 3. 유틸/헬퍼 파일

**camelCase 또는 kebab-case**

```
✅ formatDate.ts
✅ validateEmail.ts
✅ api-client.ts

❌ FormatDate.ts
❌ validate_email.ts
```

### 4. 타입 정의 파일

**types.ts 또는 {domain}.types.ts**

```
entities/user/
├── types.ts           ✅ (단일 도메인)
└── model/
    └── user.types.ts  ✅ (세부 분류)
```

### 5. 폴더 네이밍

**kebab-case (FSD 표준)**

```
features/
├── add-to-cart/       ✅
├── update-profile/    ✅
└── write-review/      ✅

❌ AddToCart/
❌ update_profile/
❌ writeReview/
```

**예외: 컴포넌트 폴더**

```
shared/ui/
├── Button/            ✅ PascalCase (컴포넌트)
│   ├── Button.tsx
│   └── Button.module.css
└── Input/
```

---

## 변수 및 함수 네이밍

### 1. Boolean 변수

**is/has/should/can 접두사**

```tsx
// ✅ 명확한 불리언
const isLoading = true;
const hasError = false;
const shouldRedirect = true;
const canEdit = false;

// ❌ 모호함
const loading = true; // 로딩 상태인지 로딩 함수인지?
const error = false; // 에러 유무인지 에러 객체인지?
const redirect = true;
```

### 2. 함수 네이밍

**동사 + 명사**

```tsx
// ✅ CRUD 패턴
function fetchUsers() {}
function createProduct() {}
function updateOrder() {}
function deleteComment() {}

// ✅ 이벤트 핸들러 (handle + 이벤트)
function handleClick() {}
function handleSubmit() {}
function handleChange() {}

// ✅ 콜백 (on + 이벤트)
function onSuccess() {}
function onError() {}
function onComplete() {}

// ✅ 변환/계산
function formatDate() {}
function calculateTotal() {}
function parseJSON() {}
function validateEmail() {}
```

**동사 선택 가이드:**

| 동사       | 용도        | 예시                   |
| ---------- | ----------- | ---------------------- |
| fetch/get  | 데이터 조회 | fetchUser, getProducts |
| create/add | 생성        | createPost, addToCart  |
| update     | 수정        | updateProfile          |
| delete     | 삭제        | deleteComment          |
| toggle     | 상태 토글   | toggleSidebar          |
| handle     | 이벤트 처리 | handleClick            |
| validate   | 검증        | validateForm           |
| calculate  | 계산        | calculateTotal         |
| format     | 형식 변환   | formatCurrency         |

### 3. 상수

**UPPER_SNAKE_CASE (전역 상수)**

```tsx
// ✅ 설정 상수
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;
const DEFAULT_PAGE_SIZE = 20;

// ✅ 열거형 상수
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

// ✅ 로컬 상수는 camelCase
function Component() {
  const defaultValue = 'default';
  const maxCount = 100;
}
```

### 4. Private 변수 (관례)

**\_ 접두사 (TypeScript private 대신)**

```tsx
class UserService {
  private _cache: Map<string, User>;

  // 또는
  #reallyPrivate: string; // ECMAScript private
}

// React에서
function Component({ userName: _userName, ...props }) {
  // _userName은 사용하지 않음을 명시
  return <div {...props} />;
}
```

---

## React 컴포넌트 네이밍

### 1. 컴포넌트 이름

**PascalCase + 명사**

```tsx
// ✅ 명확한 컴포넌트명
export const Button = () => {};
export const UserProfile = () => {};
export const ProductCard = () => {};

// ❌ 모호함
export const button = () => {};
export const Component = () => {}; // 너무 일반적
export const Thing = () => {};
```

### 2. Props 타입

**컴포넌트명 + Props**

```tsx
// ✅ 일관된 Props 네이밍
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

interface UserProfileProps {
  user: User;
  isEditable?: boolean;
}

// ❌
interface IButton {} // I 접두사는 구식
interface PropsForButton {}
```

### 3. 이벤트 핸들러

**Props: on + 이벤트, 내부: handle + 이벤트**

```tsx
// ✅ 명확한 구분
interface ButtonProps {
  onClick: () => void; // Props (부모가 전달)
  onSubmit?: () => void;
}

const Button = ({ onClick }: ButtonProps) => {
  const handleClick = () => {
    // 내부 핸들러
    // 추가 로직
    onClick();
  };

  return <button onClick={handleClick}>Click</button>;
};

// ❌ 혼란스러움
interface ButtonProps {
  handleClick: () => void; // handle은 내부용
}
```

### 4. 커스텀 Hook

**use + 기능**

```tsx
// ✅ Hook 네이밍
function useAuth() {}
function useLocalStorage(key: string) {}
function useDebounce(value: string, delay: number) {}
function useFetchUser(userId: string) {}

// ❌
function getAuth() {} // Hook이 아닌 것처럼 보임
function authHook() {}
function Auth() {} // 컴포넌트처럼 보임
```

---

## TypeScript 타입 네이밍

### 1. Interface vs Type

**도메인 객체는 Interface, 유틸리티는 Type**

```tsx
// ✅ Interface (확장 가능한 객체)
interface User {
  id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  role: 'admin';
}

// ✅ Type (유니온, 유틸리티)
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
  data: T;
  error?: string;
};
```

### 2. Generic 네이밍

**의미 있는 이름 사용**

```tsx
// ✅ 명확한 Generic
function fetchList<TItem>(url: string): Promise<TItem[]> {}
function createStore<TState, TAction>() {}

// ✅ 단순한 경우는 T 허용
function identity<T>(value: T): T {
  return value;
}

// ❌ 의미 없는 알파벳 나열
function complex<A, B, C, D>() {}
```

### 3. Enum

**PascalCase + 단수형**

```tsx
// ✅ Enum 네이밍
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

enum OrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Shipped = 'shipped',
}

// ❌
enum USER_ROLES {} // UPPER_CASE는 상수용
enum Roles {} // 너무 일반적
```

**추천: const assertion 사용**

```tsx
// ✅ 더 나은 방법
const USER_ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
```

---

## 실무 예제

### 예제 1: 사용자 인증 기능

```tsx
// features/auth/login/types.ts
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

// features/auth/login/model/useLoginMutation.ts
export const useLoginMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (formData: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(formData);
      return response;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { loginUser, isLoading, error };
};

// features/auth/login/ui/LoginForm.tsx
export const LoginForm = () => {
  const { loginUser, isLoading } = useLoginMutation();

  const handleSubmit = async (data: LoginFormData) => {
    await loginUser(data);
  };

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
};
```

**네이밍 포인트:**

- `LoginFormData`: 폼 데이터 타입 (명확함)
- `useLoginMutation`: Hook (use 접두사)
- `isLoading`: 불리언 (is 접두사)
- `handleSubmit`: 이벤트 핸들러 (handle 접두사)
- `loginUser`: 함수 (동사 + 명사)

### 예제 2: 상품 목록 조회

```tsx
// entities/product/types.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  categoryId?: string;
}

// entities/product/api/productApi.ts
export const productAPI = {
  fetchList: async (params: ProductListParams): Promise<Product[]> => {
    const response = await fetch(`/api/products?${toQueryString(params)}`);
    return response.json();
  },

  fetchById: async (productId: string): Promise<Product> => {
    const response = await fetch(`/api/products/${productId}`);
    return response.json();
  },
};

// widgets/product-list/ui/ProductList.tsx
export const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    const data = await productAPI.fetchList({ page: 1, pageSize: 20 });
    setProducts(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

**네이밍 포인트:**

- `ProductListParams`: 파라미터 타입 (명확한 용도)
- `fetchList`, `fetchById`: API 메서드 (일관된 동사)
- `products`: 배열 (복수형)
- `product`: 단일 아이템 (단수형)
- `toQueryString`: 유틸 함수 (동사 + 명사)

### 예제 3: 폼 검증

```tsx
// shared/lib/validation/validators.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  const MIN_LENGTH = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return password.length >= MIN_LENGTH && hasUpperCase && hasLowerCase && hasNumber;
};

// features/auth/register/model/useFormValidation.ts
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (fieldName: string, value: string) => {
    let errorMessage = '';

    switch (fieldName) {
      case 'email':
        if (!validateEmail(value)) {
          errorMessage = '유효한 이메일을 입력해주세요';
        }
        break;
      case 'password':
        if (!validatePassword(value)) {
          errorMessage = '비밀번호는 8자 이상, 대소문자와 숫자를 포함해야 합니다';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    return !errorMessage;
  };

  const validateForm = (formData: Record<string, string>): boolean => {
    const isEmailValid = validateField('email', formData.email);
    const isPasswordValid = validateField('password', formData.password);

    return isEmailValid && isPasswordValid;
  };

  return { errors, validateField, validateForm };
};
```

**네이밍 포인트:**

- `validate + 대상`: 검증 함수 (일관된 패턴)
- `MIN_LENGTH`: 상수 (UPPER_SNAKE_CASE)
- `hasUpperCase`: 불리언 (has 접두사)
- `errorMessage`: 명확한 변수명
- `isEmailValid`: 불리언 (is 접두사)

---

## 안티 패턴

### 1. ❌ 축약어 남용

```tsx
// ❌ 이해하기 어려움
const usr = fetchUsr();
const prod = getProd();
const auth = chkAuth();

// ✅ 명확함
const user = fetchUser();
const product = getProduct();
const isAuthenticated = checkAuthentication();
```

**예외:** 업계 표준 축약어는 허용

- API, URL, HTTP, JSON
- ID (identifier)
- props, params, config

### 2. ❌ 헝가리안 표기법

```tsx
// ❌ 구식 (타입을 접두사로)
const strName = 'John';
const arrUsers = [];
const bIsActive = true;

// ✅ TypeScript가 타입 추론
const name: string = 'John';
const users: User[] = [];
const isActive: boolean = true;
```

### 3. ❌ 불필요한 문맥

```tsx
// ❌ 중복된 문맥
interface UserUser {} // User만으로 충분
class ProductProduct {}

// entities/user/model/userStore.ts 내부
const userUserStore = create(); // ❌
const userStore = create(); // ✅
```

### 4. ❌ 매직 넘버/문자열

```tsx
// ❌ 의미 불명
if (user.role === 1) {
}
if (status === 'active') {
} // 오타 가능성

// ✅ 상수화
const USER_ROLE = {
  ADMIN: 1,
  USER: 2,
} as const;

const ORDER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
} as const;

if (user.role === USER_ROLE.ADMIN) {
}
if (status === ORDER_STATUS.ACTIVE) {
}
```

---

## 팀 협업 가이드

### 1. 용어집 만들기

프로젝트 루트에 `GLOSSARY.md` 작성:

```markdown
# 프로젝트 용어집

## 도메인 용어

- User: 일반 사용자
- Admin: 관리자
- Product: 상품
- Order: 주문

## 기술 용어

- fetch: API 데이터 조회
- create: 새 데이터 생성
- update: 기존 데이터 수정
- delete: 데이터 삭제
```

### 2. Code Review 체크리스트

```markdown
- [ ] 변수명이 의미를 명확히 표현하는가?
- [ ] 불리언 변수에 is/has/should 접두사를 사용했는가?
- [ ] 함수명이 동사+명사 패턴인가?
- [ ] 상수는 UPPER_SNAKE_CASE인가?
- [ ] 타입명과 인터페이스명이 명확한가?
- [ ] 축약어 없이 작성했는가? (표준 축약어 제외)
```

### 3. ESLint 규칙 추가

```js
// eslint.config.js
export default [
  {
    rules: {
      // 변수명 최소 길이
      'id-length': ['error', { min: 2, exceptions: ['i', 'x', 'y'] }],

      // camelCase 강제
      camelcase: ['error', { properties: 'never' }],

      // 매직 넘버 금지
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
    },
  },
];
```

---

## 핵심 정리

### 네이밍 체크리스트

**파일:**

- [ ] 컴포넌트: PascalCase.tsx
- [ ] Hook: camelCase.ts (use 접두사)
- [ ] 유틸: camelCase.ts
- [ ] 폴더: kebab-case

**변수:**

- [ ] 불리언: is/has/should/can 접두사
- [ ] 상수: UPPER_SNAKE_CASE (전역), camelCase (로컬)
- [ ] 배열: 복수형 (users, products)

**함수:**

- [ ] 동사 + 명사 (fetchUser, createOrder)
- [ ] 이벤트 핸들러: handle + 이벤트
- [ ] 콜백: on + 이벤트
- [ ] Hook: use + 기능

**타입:**

- [ ] Interface: PascalCase
- [ ] Props: 컴포넌트명 + Props
- [ ] Generic: 의미 있는 이름 (TItem, TState)

### 금지 사항

- ❌ 헝가리안 표기법 (strName, arrUsers)
- ❌ 불필요한 축약 (usr, prod, auth)
- ❌ 매직 넘버/문자열
- ❌ 중복된 문맥 (userUser, productProduct)

---

## 다음 단계

1. **[Git 워크플로우](./04-git-workflow-guide.md)** - 협업 전략
2. **[성능 최적화](./05-performance-guide.md)** - 실전 최적화
3. **[접근성](./06-accessibility-guide.md)** - a11y 가이드

---

## 참고 자료

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
