# VSCode 설정 가이드

> 팀 전체가 동일한 개발 환경 사용하기

## 📋 목차

- [VSCode 설정이란?](#vscode-설정이란)
- [기본 설정](#기본-설정)
- [설정 파일 종류](#설정-파일-종류)
- [실전 시나리오](#실전-시나리오)
- [트러블슈팅](#트러블슈팅)

---

## VSCode 설정이란?

### 개념

**VSCode Workspace Settings**는 프로젝트별 개발 환경 설정을 공유하는 시스템입니다.

**핵심 원리:**

- `.vscode/` 폴더에 설정 파일 저장
- Git으로 팀과 공유
- 모든 팀원이 동일한 환경 사용

### 왜 필요한가?

**문제 상황:**

```
개발자 A: Prettier 안 켜져 있음 → 코드 포맷 제각각
개발자 B: ESLint 수동 실행 → 린트 에러 놓침
개발자 C: 탭 4칸 사용 → 다른 사람은 2칸
```

**VSCode 설정 적용 후:**

```
✅ 저장하면 자동으로 Prettier 포맷팅
✅ 타이핑하면 ESLint 에러 즉시 표시
✅ import 자동 정렬, 미사용 코드 자동 제거
✅ 팀 전체가 동일한 포맷, 동일한 확장
```

---

## 기본 설정

### 1단계: settings.json 생성

**`.vscode/settings.json`:**

```json
{
  // 포맷터 설정
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // ESLint 설정
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // 파일 설정
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true
}
```

**각 설정 설명:**

| 설정                     | 효과                     | 예시                    |
| ------------------------ | ------------------------ | ----------------------- |
| `formatOnSave: true`     | 저장 시 자동 포맷팅      | `Cmd+S` → Prettier 실행 |
| `defaultFormatter`       | 기본 포맷터 지정         | Prettier 사용           |
| `fixAll.eslint`          | 저장 시 ESLint 자동 수정 | 세미콜론 자동 추가      |
| `organizeImports`        | import 자동 정리         | 미사용 import 제거      |
| `files.eol`              | 줄바꿈 문자 통일         | Unix 스타일 (`\n`)      |
| `trimTrailingWhitespace` | 줄 끝 공백 제거          | 코드 깔끔하게 유지      |

### 2단계: extensions.json 생성

**`.vscode/extensions.json`:**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

**각 확장 프로그램 역할:**

- **Prettier**: 코드 자동 포맷팅
- **ESLint**: 린트 에러 실시간 표시
- **Tailwind CSS**: 클래스 자동완성
- **Path Intellisense**: 파일 경로 자동완성
- **Auto Rename Tag**: HTML 태그 짝 자동 수정
- **Code Spell Checker**: 영문 맞춤법 검사

**팀원이 프로젝트 열면:**

```
VSCode가 자동으로 알림:
"이 프로젝트에 권장 확장이 있습니다. 설치하시겠습니까?"
→ 클릭 한 번으로 모든 확장 설치
```

### 3단계: 프로젝트별 커스터마이징

**TypeScript 프로젝트:**

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.preferTypeOnlyAutoImports": true
}
```

**React 프로젝트:**

```json
{
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "emmet.triggerExpansionOnTab": true
}
```

**Tailwind 프로젝트:**

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## 설정 파일 종류

### 1. settings.json (필수)

**용도:** 에디터 동작 방식 설정

**구조:**

```
.vscode/
└── settings.json    # 프로젝트 설정
```

**전체 템플릿:**

```json
{
  // === 에디터 기본 설정 ===
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.rulers": [80, 120],

  // === 코드 액션 ===
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // === 파일 설정 ===
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/.next": true
  },

  // === 언어별 설정 ===
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // === ESLint ===
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],

  // === TypeScript ===
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",

  // === Tailwind CSS ===
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### 2. extensions.json (권장)

**용도:** 팀 권장 확장 프로그램 목록

**카테고리별 확장:**

**필수 (코드 품질):**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode", // 포맷터
    "dbaeumer.vscode-eslint" // 린터
  ]
}
```

**React/Next.js:**

```json
{
  "recommendations": [
    "dsznajder.es7-react-js-snippets", // React 스니펫
    "bradlc.vscode-tailwindcss", // Tailwind 지원
    "formulahendry.auto-rename-tag" // 태그 자동 수정
  ]
}
```

**TypeScript:**

```json
{
  "recommendations": [
    "yoavbls.pretty-ts-errors", // 에러 메시지 개선
    "usernamehw.errorlens" // 인라인 에러 표시
  ]
}
```

**생산성:**

```json
{
  "recommendations": [
    "christian-kohler.path-intellisense", // 경로 자동완성
    "streetsidesoftware.code-spell-checker", // 맞춤법 검사
    "eamodio.gitlens", // Git 히스토리
    "wayou.vscode-todo-highlight" // TODO 하이라이트
  ]
}
```

### 3. launch.json (디버깅)

**용도:** 디버깅 설정

**Next.js 디버깅 설정:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### 4. tasks.json (작업 자동화)

**용도:** 자주 사용하는 명령어 단축키로 등록

**예시:**

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Run Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "npm test",
      "group": {
        "kind": "test",
        "isDefault": true
      }
    }
  ]
}
```

**사용법:**

```
Cmd+Shift+P → Tasks: Run Task → Run Dev Server
```

---

## 실전 시나리오

### 시나리오 1: Next.js + TypeScript 프로젝트

**요구사항:**

- TypeScript 엄격 모드
- Tailwind CSS 지원
- 저장 시 자동 린트/포맷

**`.vscode/settings.json`:**

```json
{
  // 기본 포맷터
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // ESLint 자동 수정
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // TypeScript
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.preferences.preferTypeOnlyAutoImports": true,
  "typescript.tsdk": "node_modules/typescript/lib",

  // Tailwind CSS
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "tailwindCSS.emmetCompletions": true,

  // 파일
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,

  // 언어별
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**`.vscode/extensions.json`:**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "yoavbls.pretty-ts-errors",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag"
  ]
}
```

### 시나리오 2: 모노레포 프로젝트

**요구사항:**

- 패키지별 다른 설정 적용
- ESLint 설정 파일 인식

**루트 `.vscode/settings.json`:**

```json
{
  // ESLint 작업 공간 폴더 인식
  "eslint.workingDirectories": [{ "mode": "auto" }],

  // 공통 설정
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 패키지별 설정
  "eslint.options": {
    "overrideConfigFile": ".eslintrc.js"
  }
}
```

**패키지별 추가 설정:**

```
packages/
├── web/
│   └── .vscode/settings.json    # Next.js 설정
└── api/
    └── .vscode/settings.json    # Node.js 설정
```

### 시나리오 3: 팀 협업 프로젝트

**요구사항:**

- 코딩 스타일 강제
- Git 연동
- 자동 TODO 추적

**`.vscode/settings.json`:**

```json
{
  // 기본 설정
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 코드 액션
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // 코딩 스타일 강제
  "editor.rulers": [80, 120],
  "editor.tabSize": 2,
  "editor.insertSpaces": true,

  // TODO 하이라이트
  "todohighlight.keywords": [
    {
      "text": "TODO:",
      "color": "#fff",
      "backgroundColor": "#ffbd2e"
    },
    {
      "text": "FIXME:",
      "color": "#fff",
      "backgroundColor": "#f06292"
    }
  ],

  // Git 설정
  "git.autofetch": true,
  "git.confirmSync": false,
  "gitlens.currentLine.enabled": false
}
```

**`.vscode/extensions.json`:**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "eamodio.gitlens",
    "wayou.vscode-todo-highlight",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

---

## 고급 설정

### 1. 조건부 설정

**운영체제별 설정:**

```json
{
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.shell.osx": "/bin/zsh",
  "terminal.integrated.shell.linux": "/bin/bash"
}
```

**언어별 포맷터:**

```json
{
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[go]": {
    "editor.defaultFormatter": "golang.go"
  }
}
```

### 2. 성능 최적화

**대용량 프로젝트 설정:**

```json
{
  // 파일 감시 제외
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/node_modules/**": true,
    "**/.next/**": true,
    "**/dist/**": true,
    "**/.turbo/**": true
  },

  // 검색 제외
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/coverage": true
  },

  // ESLint 성능
  "eslint.runtime": "node",
  "eslint.options": {
    "cache": true
  }
}
```

### 3. 사용자 vs 워크스페이스 설정

**사용자 설정 (개인용):**

```json
// ~/Library/Application Support/Code/User/settings.json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono",
  "workbench.colorTheme": "One Dark Pro"
}
```

**워크스페이스 설정 (팀 공유):**

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

**우선순위:**

```
워크스페이스 설정 > 사용자 설정 > 기본 설정
```

### 4. 스니펫 공유

**`.vscode/snippets.code-snippets`:**

```json
{
  "React Functional Component": {
    "scope": "typescriptreact",
    "prefix": "rfc",
    "body": [
      "interface ${1:ComponentName}Props {",
      "  $2",
      "}",
      "",
      "export const ${1:ComponentName} = ({ $3 }: ${1:ComponentName}Props) => {",
      "  return (",
      "    <div>",
      "      $0",
      "    </div>",
      "  )",
      "}"
    ],
    "description": "Create React Functional Component with TypeScript"
  }
}
```

**사용법:**

```tsx
// rfc 입력 → Tab
interface MyComponentProps {}

export const MyComponent = ({}: MyComponentProps) => {
  return <div></div>;
};
```

---

## 트러블슈팅

### 문제 1: Prettier가 작동하지 않음

**증상:**

```
파일 저장해도 포맷팅 안 됨
```

**해결:**

**1. Prettier 확장 설치 확인:**

```
Cmd+Shift+X → "Prettier" 검색 → 설치
```

**2. 기본 포맷터 설정:**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**3. 수동 포맷 테스트:**

```
Cmd+Shift+P → Format Document
```

**4. Prettier 설정 파일 확인:**

```bash
# .prettierrc 존재 확인
ls -la .prettierrc
```

### 문제 2: ESLint 에러가 표시되지 않음

**증상:**

```
린트 에러가 있는데 VSCode에서 안 보임
```

**해결:**

**1. ESLint 확장 설치:**

```
Cmd+Shift+X → "ESLint" 검색 → 설치
```

**2. ESLint 재시작:**

```
Cmd+Shift+P → ESLint: Restart ESLint Server
```

**3. 설정 확인:**

```json
{
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"]
}
```

**4. node_modules 확인:**

```bash
# ESLint 설치 확인
npm list eslint
```

### 문제 3: 팀원마다 다른 포맷 적용됨

**문제:** 개인 설정이 프로젝트 설정을 덮어씀

**해결:**

**1. 워크스페이스 설정 우선 순위 확인:**

```
Cmd+Shift+P → Preferences: Open Workspace Settings (JSON)
```

**2. 명확한 설정:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 언어별 명시
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

**3. .editorconfig 추가:**

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

### 문제 4: 확장 프로그램 권장이 안 뜸

**증상:** 프로젝트 열어도 "권장 확장 설치" 알림 안 나타남

**해결:**

**1. extensions.json 위치 확인:**

```bash
# 올바른 위치
.vscode/extensions.json
```

**2. 수동 설치 명령:**

```
Cmd+Shift+P → Extensions: Show Recommended Extensions
```

**3. extensions.json 형식 확인:**

```json
{
  "recommendations": ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"]
}
```

---

## 템플릿

### 최소 설정 (개인 프로젝트)

**`.vscode/settings.json`:**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

**`.vscode/extensions.json`:**

```json
{
  "recommendations": ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint"]
}
```

### 완전한 설정 (팀 프로젝트)

**`.vscode/settings.json`:**

```json
{
  // 에디터
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "editor.rulers": [80, 120],

  // 코드 액션
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },

  // 파일
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/.next": true
  },

  // ESLint
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"],

  // TypeScript
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",

  // Tailwind
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

**`.vscode/extensions.json`:**

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "yoavbls.pretty-ts-errors",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "streetsidesoftware.code-spell-checker",
    "eamodio.gitlens"
  ]
}
```

**`.editorconfig`:**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

---

## 다음 단계

1. **[CI/CD 가이드](./11-cicd-guide.md)** - GitHub Actions 설정
2. **[환경 변수 가이드](./12-env-guide.md)** - 환경별 설정 관리

---

## 참고 자료

- [VSCode 공식 문서](https://code.visualstudio.com/docs)
- [VSCode 설정 동기화](https://code.visualstudio.com/docs/editor/settings-sync)
- [워크스페이스 설정](https://code.visualstudio.com/docs/getstarted/settings)
