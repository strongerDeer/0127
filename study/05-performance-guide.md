# Next.js 성능 최적화 가이드

> 실전 성능 개선 기법

## 📋 목차

- [성능 측정](#성능-측정)
- [React 최적화](#react-최적화)
- [Next.js 최적화](#nextjs-최적화)
- [번들 크기 최적화](#번들-크기-최적화)
- [이미지 최적화](#이미지-최적화)
- [네트워크 최적화](#네트워크-최적화)

---

## 성능 측정

### 1. Lighthouse 활용

```bash
# Chrome DevTools
F12 → Lighthouse → Analyze page load

# CLI
npm install -g lighthouse
lighthouse https://your-app.com --view
```

**핵심 지표:**

- **FCP** (First Contentful Paint): 첫 콘텐츠 표시 시간
- **LCP** (Largest Contentful Paint): 최대 콘텐츠 표시 시간
- **TTI** (Time to Interactive): 상호작용 가능 시간
- **CLS** (Cumulative Layout Shift): 레이아웃 이동
- **TBT** (Total Blocking Time): 차단 시간

**목표:**

- FCP < 1.8s
- LCP < 2.5s
- CLS < 0.1
- TTI < 3.8s

### 2. Next.js Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. React DevTools Profiler

```tsx
// 개발 중 성능 측정
import { Profiler } from 'react';

function onRenderCallback(
  id, // 트리 ID
  phase, // "mount" | "update"
  actualDuration, // 렌더링 소요 시간
  baseDuration, // 메모이제이션 없을 때 예상 시간
  startTime,
  commitTime
) {
  console.log(`${id} ${phase}: ${actualDuration}ms`);
}

<Profiler id='ProductList' onRender={onRenderCallback}>
  <ProductList />
</Profiler>;
```

---

## React 최적화

### 1. 불필요한 리렌더링 방지

#### React.memo

```tsx
// ❌ 부모가 리렌더링될 때마다 자식도 리렌더링
const ProductCard = ({ product }) => {
  console.log('ProductCard render');
  return <div>{product.name}</div>;
};

// ✅ props가 변경될 때만 리렌더링
const ProductCard = React.memo(({ product }) => {
  console.log('ProductCard render');
  return <div>{product.name}</div>;
});

// ✅ 커스텀 비교 함수
const ProductCard = React.memo(
  ({ product }) => {
    return <div>{product.name}</div>;
  },
  (prevProps, nextProps) => {
    // true 반환 시 리렌더링 스킵
    return prevProps.product.id === nextProps.product.id;
  }
);
```

#### useMemo로 계산 결과 메모이제이션

```tsx
// ❌ 매번 재계산
function ProductList({ products }) {
  const expensiveProducts = products.filter((p) => p.price > 100000);
  const sortedProducts = expensiveProducts.sort((a, b) => b.price - a.price);

  return <div>{sortedProducts.map((p) => <ProductCard key={p.id} />)}</div>;
}

// ✅ products 변경 시에만 재계산
function ProductList({ products }) {
  const sortedProducts = useMemo(() => {
    const expensive = products.filter((p) => p.price > 100000);
    return expensive.sort((a, b) => b.price - a.price);
  }, [products]);

  return <div>{sortedProducts.map((p) => <ProductCard key={p.id} />)}</div>;
}
```

#### useCallback으로 함수 메모이제이션

```tsx
// ❌ 매 렌더링마다 새 함수 생성
function ProductList() {
  const handleClick = (id) => {
    console.log(id);
  };

  return products.map((p) => (
    <ProductCard key={p.id} onClick={() => handleClick(p.id)} />
  ));
}

// ✅ 함수 메모이제이션
function ProductList() {
  const handleClick = useCallback((id) => {
    console.log(id);
  }, []);

  return products.map((p) => (
    <ProductCard key={p.id} onClick={() => handleClick(p.id)} />
  ));
}

// ✅ 더 나은 방법: 개별 함수 전달
function ProductList() {
  return products.map((p) => (
    <ProductCard
      key={p.id}
      product={p}
      onClickHandler={() => console.log(p.id)}
    />
  ));
}
```

### 2. 리스트 렌더링 최적화

#### 가상 스크롤 (Virtual Scrolling)

```bash
npm install @tanstack/react-virtual
```

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function ProductList({ products }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: products.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // 아이템 높이
    overscan: 5, // 화면 밖 추가 렌더링 개수
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProductCard product={products[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**효과:**

- 1000개 아이템 → 실제 렌더링 10~20개
- 메모리 사용량 크게 감소
- 부드러운 스크롤

### 3. Lazy Loading

#### 컴포넌트 지연 로딩

```tsx
import { Suspense, lazy } from 'react';

// ✅ 필요할 때만 로드
const HeavyChart = lazy(() => import('@/widgets/HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  );
}
```

#### 조건부 지연 로딩

```tsx
function ProductDetail() {
  const [showReviews, setShowReviews] = useState(false);

  // ✅ 버튼 클릭 시에만 로드
  const Reviews = useMemo(() => lazy(() => import('@/widgets/Reviews')), []);

  return (
    <div>
      <ProductInfo />
      <button onClick={() => setShowReviews(true)}>리뷰 보기</button>
      {showReviews && (
        <Suspense fallback={<div>로딩 중...</div>}>
          <Reviews />
        </Suspense>
      )}
    </div>
  );
}
```

---

## Next.js 최적화

### 1. Server Components 활용

```tsx
// ✅ 서버 컴포넌트 (기본)
// app/products/page.tsx
async function ProductsPage() {
  const products = await fetchProducts(); // 서버에서 실행

  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// ✅ 클라이언트 컴포넌트 (필요시)
// app/products/ProductFilter.tsx
('use client');

export function ProductFilter() {
  const [filter, setFilter] = useState('all');

  return <select value={filter} onChange={(e) => setFilter(e.target.value)} />;
}
```

**원칙:**

- 기본: Server Component
- 상태/이벤트 필요 시: Client Component
- 최대한 하위에서 'use client' 선언

### 2. Streaming SSR

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div>
      <Header /> {/* 즉시 표시 */}
      <Suspense fallback={<Skeleton />}>
        <UserStats /> {/* 비동기 로딩 */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <RecentActivity /> {/* 비동기 로딩 */}
      </Suspense>
    </div>
  );
}

// UserStats는 async 컴포넌트
async function UserStats() {
  const stats = await fetchUserStats(); // 느린 API
  return <div>{/* ... */}</div>;
}
```

**효과:**

- 빠른 부분 먼저 표시
- 느린 부분은 로딩 중 표시
- TTI 개선

### 3. Route Prefetching

```tsx
// ✅ 자동 prefetch (기본)
import Link from 'next/link';
// → 뷰포트에 들어오면 자동 prefetch

// ✅ 수동 prefetch
import { useRouter } from 'next/navigation';

<Link href='/products'>상품 목록</Link>;

function ProductCard() {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch('/products/123');
  };

  return <div onMouseEnter={handleMouseEnter}>...</div>;
}
```

### 4. Incremental Static Regeneration (ISR)

```tsx
// app/products/[id]/page.tsx
export const revalidate = 60; // 60초마다 재생성

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);
  return <ProductDetail product={product} />;
}
```

**효과:**

- 정적 페이지의 속도 + 동적 데이터
- 60초마다 자동 업데이트
- CDN 캐싱 활용

---

## 번들 크기 최적화

### 1. 번들 분석

```bash
npm install @next/bundle-analyzer
```

```js
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer({
  // Next.js 설정
});
```

```bash
ANALYZE=true npm run build
```

### 2. Tree Shaking

```tsx
// ❌ 전체 라이브러리 import
import _ from 'lodash';
// ✅ 필요한 것만 import
import { debounce } from 'lodash-es';
import * as Icons from 'lucide-react';
import { ShoppingCart, User } from 'lucide-react';
```

### 3. Dynamic Import

```tsx
// ❌ 초기 번들에 포함
import Chart from 'chart.js';

// ✅ 필요할 때만 로드
const loadChart = async () => {
  const Chart = (await import('chart.js')).default;
  return Chart;
};
```

### 4. 폰트 최적화

```tsx
// app/layout.tsx
import { Pretendard } from '@/shared/font';

export default function RootLayout({ children }) {
  return (
    <html className={Pretendard.className}>
      <body>{children}</body>
    </html>
  );
}

// shared/font/index.ts
import localFont from 'next/font/local';

export const Pretendard = localFont({
  src: './PretendardVariable.woff2',
  display: 'swap', // FOIT 방지
  weight: '45 920',
  variable: '--font-pretendard',
});
```

---

## 이미지 최적화

### 1. Next.js Image 컴포넌트

```tsx
import Image from 'next/image';

// ✅ 자동 최적화
<Image
  src='/product.jpg'
  alt='상품 이미지'
  width={400}
  height={300}
  priority // LCP 이미지는 priority
  placeholder='blur' // 블러 처리
  blurDataURL='data:image/...' // 작은 블러 이미지
/>;

// ✅ 외부 이미지
<Image
  src='https://example.com/image.jpg'
  alt='외부 이미지'
  width={400}
  height={300}
  loader={({ src, width, quality }) => {
    return `https://cdn.example.com/${src}?w=${width}&q=${quality || 75}`;
  }}
/>;
```

**설정:**

```js
// next.config.ts
export default {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
};
```

### 2. Responsive Images

```tsx
<Image
  src='/hero.jpg'
  alt='히어로'
  fill // 부모 크기에 맞춤
  sizes='(max-width: 768px) 100vw, 50vw'
  style={{ objectFit: 'cover' }}
/>
```

### 3. 지연 로딩

```tsx
// ✅ 뷰포트 진입 시 로드
<Image
  src='/below-fold.jpg'
  alt='아래 이미지'
  width={400}
  height={300}
  loading='lazy' // 기본값
/>
```

---

## 네트워크 최적화

### 1. React Query로 캐싱

```tsx
import { useQuery } from '@tanstack/react-query';

function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    cacheTime: 10 * 60 * 1000, // 10분간 캐시
  });
}

// 컴포넌트에서 사용
function ProductDetail({ id }) {
  const { data, isLoading } = useProduct(id);

  if (isLoading) return <Spinner />;
  return <div>{data.name}</div>;
}
```

**효과:**

- 동일한 데이터 재요청 방지
- 자동 백그라운드 refetch
- Optimistic Update 지원

### 2. 요청 병렬화

```tsx
// ❌ 순차 요청 (느림)
const user = await fetchUser();
const products = await fetchProducts();
const reviews = await fetchReviews();

// ✅ 병렬 요청 (빠름)
const [user, products, reviews] = await Promise.all([
  fetchUser(),
  fetchProducts(),
  fetchReviews(),
]);
```

### 3. Debounce/Throttle

```tsx
import { useDebouncedCallback } from 'use-debounce';

function SearchInput() {
  const [search, setSearch] = useState('');

  // ✅ 500ms 후 한 번만 실행
  const debouncedSearch = useDebouncedCallback((value) => {
    searchProducts(value);
  }, 500);

  return (
    <input
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

### 4. Compression

```js
// next.config.ts
export default {
  compress: true, // Gzip 압축 활성화
};
```

---

## 성능 최적화 체크리스트

### 렌더링 최적화

- [ ] React.memo로 불필요한 리렌더링 방지
- [ ] useMemo/useCallback로 값/함수 메모이제이션
- [ ] 가상 스크롤로 긴 리스트 최적화
- [ ] Lazy Loading으로 코드 분할

### Next.js 최적화

- [ ] Server Components 우선 사용
- [ ] Streaming SSR로 TTFB 개선
- [ ] ISR로 정적 + 동적 이점 활용
- [ ] Route Prefetching 활용

### 번들 최적화

- [ ] Bundle Analyzer로 크기 분석
- [ ] Tree Shaking 적용 (named import)
- [ ] Dynamic Import로 코드 분할
- [ ] 폰트 최적화 (로컬 폰트, display: swap)

### 이미지 최적화

- [ ] Next.js Image 컴포넌트 사용
- [ ] priority로 LCP 이미지 우선 로딩
- [ ] lazy loading으로 아래 이미지 지연
- [ ] WebP/AVIF 형식 사용

### 네트워크 최적화

- [ ] React Query로 캐싱
- [ ] Promise.all로 병렬 요청
- [ ] Debounce/Throttle 적용
- [ ] Gzip 압축 활성화

---

## 실전 예제: 상품 목록 최적화

### Before (느린 버전)

```tsx
function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  const filteredProducts = products.filter((p) => p.price > 10000);
  const sortedProducts = filteredProducts.sort((a, b) => b.price - a.price);

  return (
    <div>
      {sortedProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### After (최적화 버전)

```tsx
function ProductList() {
  // ✅ React Query로 캐싱
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  });

  // ✅ useMemo로 계산 메모이제이션
  const sortedProducts = useMemo(() => {
    const filtered = products.filter((p) => p.price > 10000);
    return filtered.sort((a, b) => b.price - a.price);
  }, [products]);

  // ✅ 가상 스크롤
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: sortedProducts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              transform: `translateY(${item.start}px)`,
            }}
          >
            <MemoizedProductCard product={sortedProducts[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ React.memo
const MemoizedProductCard = React.memo(ProductCard);
```

**개선 효과:**

- 렌더링 시간: 500ms → 50ms (10배)
- 메모리 사용: 1000개 → 20개 렌더링
- API 호출: 매번 → 5분 캐싱

---

## 다음 단계

1. **[접근성](./06-accessibility-guide.md)** - a11y 가이드
2. **[테스트](./07-testing-guide.md)** - 테스트 전략
3. **[트러블슈팅](./08-troubleshooting-guide.md)** - 문제 해결

---

## 참고 자료

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React DevTools Profiler](https://react.dev/reference/react/Profiler)
- [Web.dev Performance](https://web.dev/performance/)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
