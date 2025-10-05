# Zod 기본 사용법 가이드

## 📋 목차

1. [Zod란?](#zod란)
2. [설치 및 기본 개념](#설치-및-기본-개념)
3. [기본 타입 검증](#기본-타입-검증)
4. [실전 예제](#실전-예제)
5. [환경 변수 검증 (프로젝트 적용)](#환경-변수-검증)

---

## 🎯 Zod란?

**TypeScript-first 스키마 검증 라이브러리**

```ts
// TypeScript: 컴파일 타임 체크
const name: string = 'John'; // ✅

// Zod: 런타임 체크 + 타입 추론
const nameSchema = z.string();
nameSchema.parse('John'); // ✅
nameSchema.parse(123); // ❌ 에러 발생
```

**왜 필요한가?**

- ✅ API 응답 검증
- ✅ 폼 입력값 검증
- ✅ 환경 변수 검증
- ✅ 런타임 타입 안전성

---

## 📦 설치 및 기본 개념

### 설치

```bash
npm install zod
```

### 기본 사용법

```ts
import { z } from 'zod';

// 1. 스키마 정의
const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// 2. 데이터 검증
const user = userSchema.parse({
  name: 'John',
  age: 30,
}); // ✅ 통과

// 3. 타입 자동 추론
type User = z.infer<typeof userSchema>;
// { name: string; age: number; }
```

---

## 🔤 기본 타입 검증

### 1. 문자열 (String)

```ts
// 기본
z.string(); // 문자열

// 검증 추가
z.string().min(3); // 최소 3자
z.string().max(10); // 최대 10자
z.string().length(5); // 정확히 5자
z.string().email(); // 이메일 형식
z.string().url(); // URL 형식
z.string().uuid(); // UUID 형식

// 커스텀 에러 메시지
z.string().min(3, '최소 3자 이상 입력해주세요');
```

### 2. 숫자 (Number)

```ts
// 기본
z.number(); // 숫자

// 검증 추가
z.number().min(0); // 최소값
z.number().max(100); // 최대값
z.number().int(); // 정수만
z.number().positive(); // 양수만
z.number().negative(); // 음수만
```

### 3. 불리언 (Boolean)

```ts
z.boolean(); // true 또는 false
```

### 4. 날짜 (Date)

```ts
z.date(); // Date 객체
z.date().min(new Date('2024-01-01')); // 최소 날짜
```

### 5. 배열 (Array)

```ts
z.array(z.string()); // 문자열 배열
z.array(z.number()).min(1); // 최소 1개 이상
z.array(z.number()).max(5); // 최대 5개
```

### 6. 객체 (Object)

```ts
z.object({
  name: z.string(),
  age: z.number(),
});
```

---

## 🔧 고급 기능

### 1. 선택적 필드 (Optional)

```ts
z.object({
  name: z.string(), // 필수
  email: z.string().optional(), // 선택
});

// 또는
z.object({
  name: z.string(),
  email: z.string(),
}).partial(); // 모든 필드를 선택적으로
```

### 2. 기본값 (Default)

```ts
z.object({
  name: z.string(),
  role: z.string().default('user'), // 기본값: 'user'
});
```

### 3. 합집합 (Union)

```ts
// 문자열 또는 숫자
z.union([z.string(), z.number()]);

// 특정 값만 허용
z.enum(['admin', 'user', 'guest']);
```

### 4. Nullable

```ts
z.string().nullable(); // string | null
z.string().nullish(); // string | null | undefined
```

### 5. 변환 (Transform)

```ts
// 문자열을 숫자로 변환
z.string().transform((val) => parseInt(val));

// 날짜 문자열을 Date 객체로
z.string().transform((val) => new Date(val));
```

---

## 🎯 실전 예제

### 1. API 응답 검증

```ts
// API 응답 스키마
const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().transform((val) => new Date(val)),
});

// 사용
async function fetchUser(id: number) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // 검증 + 타입 추론
  const user = userResponseSchema.parse(data);
  return user; // 타입 안전!
}
```

### 2. 폼 검증

```ts
// 회원가입 폼 스키마
const signupSchema = z
  .object({
    email: z.string().email('올바른 이메일을 입력해주세요'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상입니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

// 사용
function handleSubmit(formData: unknown) {
  try {
    const validData = signupSchema.parse(formData);
    // 회원가입 로직
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 에러 메시지 표시
      console.log(error.errors);
    }
  }
}
```

### 3. 중첩된 객체 검증

```ts
const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(10),
  author: z.object({
    id: z.number(),
    name: z.string(),
  }),
  tags: z.array(z.string()),
  published: z.boolean().default(false),
});

type Post = z.infer<typeof postSchema>;
// {
//   title: string;
//   content: string;
//   author: { id: number; name: string };
//   tags: string[];
//   published: boolean;
// }
```

---

## 🌍 환경 변수 검증 (프로젝트 적용)

### 현재 프로젝트 구조

```ts
// src/shared/config/env.ts
import { z } from 'zod';

/**
 * 환경 변수 스키마 정의
 * - Zod를 사용하여 환경 변수의 타입과 필수 여부 검증
 * - 앱 실행 시점에 환경 변수 누락/오류 감지
 */
const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API 키 (필수)'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase 인증 도메인 (필수)'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase 프로젝트 ID (필수)'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage 버킷 (필수)'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase 메시징 발신자 ID (필수)'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase 앱 ID (필수)'),
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(), // 선택
});

/**
 * 검증된 환경 변수 객체
 * - process.env를 스키마로 검증하여 타입 안전성 보장
 * - 이 객체를 import하면 자동완성 지원
 * - 런타임에 환경 변수 누락 시 명확한 에러 메시지 출력
 */
export const env = envSchema.parse(process.env);
```

### 사용 방법

```ts
// ❌ 기존: 타입 불안전
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY; // string | undefined

// ✅ 개선: 타입 안전 + 자동완성
import { env } from '@/shared/config/env';

const apiKey = env.NEXT_PUBLIC_FIREBASE_API_KEY; // string (확정)
```

### 에러 처리

```ts
// 환경 변수 누락 시
// ❌ ZodError: Firebase API 키 (필수)
// 앱이 시작되지 않고 명확한 에러 표시

// .env.local에 값 추가 후
// ✅ 정상 실행
```

---

## 🔍 에러 처리

### parse vs safeParse

```ts
// parse: 에러 발생 시 throw
try {
  const user = userSchema.parse(data);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.errors);
  }
}

// safeParse: 에러를 객체로 반환 (추천)
const result = userSchema.safeParse(data);

if (result.success) {
  console.log(result.data); // 검증된 데이터
} else {
  console.log(result.error.errors); // 에러 목록
}
```

### 에러 메시지 커스터마이징

```ts
const schema = z.object({
  email: z.string().email({ message: '올바른 이메일을 입력해주세요' }),
  age: z.number({
    required_error: '나이는 필수입니다',
    invalid_type_error: '나이는 숫자여야 합니다',
  }),
});
```

---

## 📝 프로젝트 적용 예시

### 1. API 호출 시 응답 검증

```ts
// src/shared/api/user.ts
import { z } from 'zod';

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

export async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();

  // 런타임 검증
  return userSchema.parse(data);
}
```

### 2. Firestore 문서 검증

```ts
// src/entities/post/model/schema.ts
import { z } from 'zod';

export const postSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '제목을 입력해주세요'),
  content: z.string().min(10, '내용은 최소 10자 이상입니다'),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Post = z.infer<typeof postSchema>;

// Firestore에서 가져온 데이터 검증
export function parsePost(data: unknown): Post {
  return postSchema.parse(data);
}
```

---

## 🎓 학습 순서

### 1단계: 기본 타입

- ✅ string, number, boolean 검증
- ✅ min, max, email 같은 기본 메서드

### 2단계: 복합 타입

- ✅ object, array 검증
- ✅ optional, default 사용

### 3단계: 실전 적용

- ✅ 환경 변수 검증 (현재 프로젝트)
- ✅ API 응답 검증
- ✅ 폼 검증

---

## 🔗 참고 자료

- [Zod 공식 문서](https://zod.dev)
- [환경 변수 검증 예제](https://github.com/t3-oss/t3-env)
- [React Hook Form + Zod](https://react-hook-form.com/get-started#SchemaValidation)

---

## 💡 프로젝트 적용 팁

### 현재 프로젝트에서 Zod 사용 중인 곳

1. **환경 변수 검증** - `src/shared/config/env.ts`

### 추후 적용 가능한 곳

1. **폼 검증** - 로그인, 회원가입 폼
2. **API 응답 검증** - Firestore 데이터
3. **URL 파라미터 검증** - 페이지 라우팅

### 주의사항

- ❌ 너무 복잡한 검증 로직은 성능 저하 가능
- ✅ 필수적인 곳에만 사용 (환경변수, API 응답, 폼)
- ✅ safeParse를 사용하여 에러를 우아하게 처리
