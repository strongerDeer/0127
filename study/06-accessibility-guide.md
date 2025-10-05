# 웹 접근성(a11y) 가이드

> 모두를 위한 웹 만들기

## 📋 목차

- [접근성이란](#접근성이란)
- [시맨틱 HTML](#시맨틱-html)
- [키보드 접근성](#키보드-접근성)
- [스크린 리더 지원](#스크린-리더-지원)
- [색상과 대비](#색상과-대비)
- [ARIA 속성](#aria-속성)

---

## 접근성이란

### 왜 중요한가?

**법적 요구사항:**

- 장애인차별금지법 (한국)
- ADA (미국), EAA (유럽)
- 공공기관 웹사이트는 의무

**비즈니스 이점:**

- 사용자 확대 (전 세계 인구의 15%가 장애인)
- SEO 개선
- 사용성 전반 향상

**기술적 이점:**

- 시맨틱 마크업으로 유지보수 용이
- 테스트 용이성
- 더 나은 코드 품질

### WCAG 2.1 기준

**Level A (최소):**

- 키보드 접근 가능
- 텍스트 대안 제공
- 색상에만 의존하지 않음

**Level AA (권장):**

- 명도 대비 4.5:1 이상
- 폼 라벨 명확
- 포커스 표시

**Level AAA (이상적):**

- 명도 대비 7:1 이상
- 수화 제공
- 확대 200% 지원

**목표: Level AA 준수**

---

## 시맨틱 HTML

### 1. 올바른 HTML 요소 사용

```tsx
// ❌ div/span 남용
<div onClick={handleClick}>클릭</div>
<div className="header">제목</div>
<span onClick={handleSubmit}>제출</span>

// ✅ 시맨틱 요소
<button onClick={handleClick}>클릭</button>
<h1>제목</h1>
<button type="submit">제출</button>
```

**이유:**

- 스크린 리더가 역할 자동 인식
- 키보드 탐색 자동 지원
- 브라우저 기본 동작 활용

### 2. 문서 구조

```tsx
// ✅ 명확한 문서 구조
export default function Page() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <a href='/'>홈</a>
            </li>
            <li>
              <a href='/products'>상품</a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <article>
          <h1>상품 목록</h1>
          <section>
            <h2>베스트 상품</h2>
            <ul>{/* 상품 리스트 */}</ul>
          </section>
        </article>
      </main>

      <footer>
        <p>&copy; 2024 Company</p>
      </footer>
    </>
  );
}
```

**구조 검증:**

```bash
# Lighthouse의 "Best Practices" 확인
# 또는 HTML5 Outliner 크롬 확장 프로그램 사용
```

### 3. 제목 계층 (Heading Hierarchy)

```tsx
// ❌ 잘못된 계층
<h1>메인 제목</h1>
<h3>부제목</h3> {/* h2 건너뜀 */}
<h2>섹션 제목</h2> {/* 순서 역전 */}

// ✅ 올바른 계층
<h1>메인 제목</h1>
<h2>섹션 제목</h2>
<h3>부제목</h3>
```

**검증:**

```bash
# headingsMap 크롬 확장 프로그램
# 또는 axe DevTools 사용
```

---

## 키보드 접근성

### 1. 키보드 탐색 지원

**기본 원칙:**

- Tab: 다음 요소
- Shift + Tab: 이전 요소
- Enter/Space: 활성화
- Esc: 닫기/취소

```tsx
// ✅ 키보드 접근 가능
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;

    // Esc 키로 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <dialog open={isOpen}>
      {children}
      <button onClick={onClose}>닫기</button>
    </dialog>
  );
}
```

### 2. 포커스 관리

```tsx
// ✅ 모달 열릴 때 포커스 이동
function Modal({ isOpen }) {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstFocusableRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <dialog>
      <button ref={firstFocusableRef}>닫기</button>
      <form>
        <input type='text' placeholder='이메일' />
        <button type='submit'>제출</button>
      </form>
    </dialog>
  );
}
```

### 3. 포커스 트랩 (Focus Trap)

```bash
npm install focus-trap-react
```

```tsx
import FocusTrap from 'focus-trap-react';

function Modal({ isOpen, children }) {
  return (
    <FocusTrap active={isOpen}>
      <dialog open={isOpen}>{children}</dialog>
    </FocusTrap>
  );
}
```

**효과:**

- 모달 밖으로 포커스 이동 방지
- Tab 키가 모달 내부만 순환

### 4. Skip Link

```tsx
// ✅ 메인 콘텐츠로 바로 이동
export default function Layout({ children }) {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
      >
        본문으로 건너뛰기
      </a>
      <nav>{/* 긴 네비게이션 */}</nav>
      <main id="main-content">
        {children}
      </main>
    </>
  );
}

// globals.css
.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus {
  left: 0;
  top: 0;
  z-index: 9999;
  padding: 1rem;
  background: #000;
  color: #fff;
}
```

---

## 스크린 리더 지원

### 1. 대체 텍스트 (Alt Text)

```tsx
// ✅ 의미 있는 alt
<Image
  src="/product.jpg"
  alt="나이키 에어맥스 270 블랙 색상 운동화"
  width={400}
  height={300}
/>

// ✅ 장식 이미지는 빈 alt
<Image
  src="/decoration.svg"
  alt=""
  width={100}
  height={100}
/>

// ❌ 나쁜 alt
<Image alt="이미지" />
<Image alt="사진.jpg" />
```

**Alt 작성 규칙:**

- 이미지가 전달하는 정보 설명
- "이미지", "사진" 같은 불필요한 단어 제외
- 장식용은 `alt=""` (빈 문자열)

### 2. 폼 라벨

```tsx
// ❌ 라벨 없음
<input type="text" placeholder="이메일" />

// ✅ 명시적 라벨
<label htmlFor="email">이메일</label>
<input id="email" type="text" />

// ✅ 암묵적 라벨
<label>
  이메일
  <input type="text" />
</label>

// ✅ aria-label (시각적 라벨 불필요 시)
<input
  type="search"
  aria-label="상품 검색"
  placeholder="검색..."
/>
```

### 3. 링크와 버튼 텍스트

```tsx
// ❌ 모호한 텍스트
<a href="/products">여기</a>
<a href="/download">클릭</a>
<button>더보기</button>

// ✅ 명확한 텍스트
<a href="/products">상품 목록 보기</a>
<a href="/report.pdf">2024 연간 보고서 다운로드 (PDF, 2MB)</a>
<button>상품 목록 더보기</button>

// ✅ 시각적으로 숨기고 스크린 리더용 텍스트
<button>
  <span aria-hidden="true">×</span>
  <span className="sr-only">모달 닫기</span>
</button>
```

**sr-only CSS:**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### 4. 동적 콘텐츠 알림

```tsx
// ✅ 실시간 업데이트 알림
function ProductAdded() {
  const [message, setMessage] = useState('');

  const handleAddToCart = () => {
    // 장바구니 추가 로직
    setMessage('상품이 장바구니에 추가되었습니다');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <>
      <button onClick={handleAddToCart}>장바구니 추가</button>
      <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
        {message}
      </div>
    </>
  );
}
```

**aria-live 속성:**

- `off`: 알리지 않음 (기본)
- `polite`: 사용자 작업이 끝난 후 알림
- `assertive`: 즉시 알림 (긴급한 경우만)

---

## 색상과 대비

### 1. 명도 대비 (Contrast Ratio)

**WCAG AA 기준:**

- 일반 텍스트: 4.5:1 이상
- 큰 텍스트 (18pt+): 3:1 이상
- UI 컴포넌트: 3:1 이상

```tsx
// ✅ 충분한 대비
<button
  style={{
    backgroundColor: '#0066CC',
    color: '#FFFFFF', // 대비 7.7:1
  }}
>
  클릭
</button>

// ❌ 대비 부족
<button
  style={{
    backgroundColor: '#CCCCCC',
    color: '#FFFFFF', // 대비 1.6:1
  }}
>
  클릭
</button>
```

**검증 도구:**

- Chrome DevTools Lighthouse
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Figma Contrast Plugin

### 2. 색상에만 의존하지 않기

```tsx
// ❌ 색상으로만 구분
<span style={{ color: 'red' }}>오류</span>
<span style={{ color: 'green' }}>성공</span>

// ✅ 아이콘/텍스트 추가
<span style={{ color: 'red' }}>
  <X size={16} /> 오류: 입력값을 확인하세요
</span>
<span style={{ color: 'green' }}>
  <Check size={16} /> 성공: 저장되었습니다
</span>
```

### 3. 다크 모드 대비

```tsx
// shared/ui/Button/Button.module.css
.button {
  background-color: light-dark(#0066cc, #4d94ff);
  color: light-dark(#ffffff, #000000);
}

/* 또는 CSS 변수 */
:root {
  --color-primary: #0066cc;
  --color-text: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #4d94ff;
    --color-text: #ffffff;
  }
}
```

---

## ARIA 속성

### 1. 역할 (role)

```tsx
// ✅ 커스텀 컴포넌트에 역할 부여
<div role="button" tabIndex={0} onClick={handleClick}>
  클릭 가능한 div
</div>

<nav role="navigation">
  <ul role="list">
    <li role="listitem">메뉴1</li>
  </ul>
</nav>

<div role="alert">
  중요: 세션이 곧 만료됩니다
</div>
```

**주의:** 시맨틱 HTML이 있다면 role 불필요

```tsx
// ❌ 중복된 role
<button role="button">클릭</button>

// ✅ role 생략
<button>클릭</button>
```

### 2. 상태 (aria-\*)

```tsx
// ✅ 아코디언
function Accordion() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls="content-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        제목
      </button>
      <div
        id="content-1"
        hidden={!isOpen}
      >
        내용
      </div>
    </div>
  );
}

// ✅ 로딩 상태
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? '처리 중...' : '제출'}
</button>

// ✅ 선택 상태
<button
  role="tab"
  aria-selected={isActive}
  tabIndex={isActive ? 0 : -1}
>
  탭
</button>
```

### 3. 레이블 (aria-label, aria-labelledby)

```tsx
// ✅ aria-label (라벨 텍스트 직접 제공)
<button aria-label="닫기">
  <X />
</button>

// ✅ aria-labelledby (다른 요소 참조)
<section aria-labelledby="section-title">
  <h2 id="section-title">상품 목록</h2>
  {/* ... */}
</section>

// ✅ aria-describedby (추가 설명)
<input
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">
  8자 이상, 대소문자와 숫자 포함
</p>
```

### 4. 실전 예제: 모달

```tsx
function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId();

  return (
    <FocusTrap active={isOpen}>
      <dialog open={isOpen} aria-modal='true' aria-labelledby={titleId} role='dialog'>
        <h2 id={titleId}>{title}</h2>
        {children}
        <button onClick={onClose} aria-label='모달 닫기'>
          <X />
        </button>
      </dialog>
    </FocusTrap>
  );
}
```

---

## 접근성 테스트

### 1. 자동화 도구

```bash
# ESLint Plugin
npm install --save-dev eslint-plugin-jsx-a11y
```

```js
// eslint.config.js
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/label-has-associated-control': 'error',
    },
  },
];
```

### 2. 수동 테스트

**키보드 테스트:**

1. 마우스 사용 금지
2. Tab으로 모든 요소 접근 가능한지 확인
3. Enter/Space로 활성화 가능한지 확인
4. 모달에서 Esc로 닫기 가능한지 확인

**스크린 리더 테스트:**

- macOS: VoiceOver (Cmd + F5)
- Windows: NVDA (무료)
- Chrome 확장: ChromeVox

**체크리스트:**

- [ ] 모든 이미지에 alt 속성
- [ ] 모든 폼 input에 label
- [ ] 키보드로 모든 기능 사용 가능
- [ ] 포커스 표시 명확
- [ ] 색상 대비 충분 (4.5:1)
- [ ] 제목 계층 올바름 (h1 → h2 → h3)
- [ ] 링크/버튼 텍스트 명확
- [ ] 동적 콘텐츠 알림 (aria-live)

### 3. 브라우저 도구

```bash
# Lighthouse (Chrome DevTools)
F12 → Lighthouse → Accessibility 체크

# axe DevTools
https://www.deque.com/axe/devtools/
```

---

## 실전 예제: 검색 폼

### Before (접근성 낮음)

```tsx
function SearchForm() {
  return (
    <div>
      <input type='text' placeholder='검색' />
      <div onClick={handleSearch}>🔍</div>
    </div>
  );
}
```

### After (접근성 높음)

```tsx
function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [announcement, setAnnouncement] = useState('');

  const handleSearch = async () => {
    const data = await searchAPI(query);
    setResults(data);
    setAnnouncement(`검색 완료. ${data.length}개의 결과가 있습니다.`);
  };

  return (
    <div role='search'>
      <label htmlFor='search-input'>상품 검색</label>
      <input
        id='search-input'
        type='search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-describedby='search-hint'
      />
      <p id='search-hint' className='sr-only'>
        상품명 또는 카테고리를 입력하세요
      </p>

      <button onClick={handleSearch} aria-label='검색 실행'>
        <Search aria-hidden='true' />
      </button>

      <div role='status' aria-live='polite' aria-atomic='true' className='sr-only'>
        {announcement}
      </div>

      <ul role='list' aria-label='검색 결과'>
        {results.map((item) => (
          <li key={item.id} role='listitem'>
            <a href={`/products/${item.id}`}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**개선 사항:**

- `role="search"` 추가
- label과 input 연결
- aria-describedby로 힌트 제공
- 버튼에 aria-label
- 아이콘에 aria-hidden
- 검색 결과 aria-live로 알림

---

## 접근성 체크리스트

### HTML

- [ ] 시맨틱 요소 사용 (button, nav, main 등)
- [ ] 제목 계층 올바름 (h1 → h2 → h3)
- [ ] 문서 구조 명확 (header, main, footer)

### 키보드

- [ ] Tab으로 모든 인터랙티브 요소 접근 가능
- [ ] Enter/Space로 버튼 활성화
- [ ] Esc로 모달/드롭다운 닫기
- [ ] 포커스 표시 명확 (outline)
- [ ] Skip Link 제공

### 스크린 리더

- [ ] 모든 이미지에 alt
- [ ] 모든 input에 label
- [ ] 링크/버튼 텍스트 명확
- [ ] 동적 콘텐츠 aria-live 알림

### 색상/대비

- [ ] 텍스트 대비 4.5:1 이상
- [ ] 색상에만 의존하지 않음
- [ ] 다크 모드 대비 충분

### ARIA

- [ ] 적절한 role 사용
- [ ] 상태 표시 (aria-expanded, aria-selected)
- [ ] 레이블 제공 (aria-label, aria-labelledby)

---

## 다음 단계

1. **[테스트](./07-testing-guide.md)** - 테스트 전략
2. **[트러블슈팅](./08-troubleshooting-guide.md)** - 문제 해결

---

## 참고 자료

- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/ko/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
