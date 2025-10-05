import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "typescript-eslint";

export default [
  {
    ignores: [
      ".next/**/*",
      "next-env.d.ts",
      "src/shadcn/**/*",
      "dev-dist/**/*",
      "dist/**/*",
      "node_modules/**/*",
      "**/*.config.{js,ts}",
      "public/**/*",
    ],
  },
  js.configs.recommended,
  ...typescriptEslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      import: importPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // React 관련
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Import 순서는 Prettier가 처리하므로 ESLint 규칙 비활성화
      "import/order": "off",

      // FSD 아키텍처 특화 규칙
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // shared는 다른 레이어에서 import 불가
            {
              target: "./src/shared/**/*",
              from: "./src/entities/**/*",
              message: "shared 레이어는 entities를 import할 수 없습니다.",
            },
            {
              target: "./src/shared/**/*",
              from: "./src/features/**/*",
              message: "shared 레이어는 features를 import할 수 없습니다.",
            },
            {
              target: "./src/shared/**/*",
              from: "./src/widgets/**/*",
              message: "shared 레이어는 widgets를 import할 수 없습니다.",
            },
            {
              target: "./src/shared/**/*",
              from: "./src/pages/**/*",
              message: "shared 레이어는 pages를 import할 수 없습니다.",
            },
            {
              target: "./src/shared/**/*",
              from: "./src/app/**/*",
              message: "shared 레이어는 app을 import할 수 없습니다.",
            },
            // entities는 features 이상 레이어 import 불가
            {
              target: "./src/entities/**/*",
              from: "./src/features/**/*",
              message: "entities 레이어는 features를 import할 수 없습니다.",
            },
            {
              target: "./src/entities/**/*",
              from: "./src/widgets/**/*",
              message: "entities 레이어는 widgets를 import할 수 없습니다.",
            },
            {
              target: "./src/entities/**/*",
              from: "./src/pages/**/*",
              message: "entities 레이어는 pages를 import할 수 없습니다.",
            },
            {
              target: "./src/entities/**/*",
              from: "./src/app/**/*",
              message: "entities 레이어는 app을 import할 수 없습니다.",
            },
            // features는 widgets 이상 레이어 import 불가
            {
              target: "./src/features/**/*",
              from: "./src/widgets/**/*",
              message: "features 레이어는 widgets를 import할 수 없습니다.",
            },
            {
              target: "./src/features/**/*",
              from: "./src/pages/**/*",
              message: "features 레이어는 pages를 import할 수 없습니다.",
            },
            {
              target: "./src/features/**/*",
              from: "./src/app/**/*",
              message: "features 레이어는 app을 import할 수 없습니다.",
            },
          ],
        },
      ],

      // TypeScript strict 규칙
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "off", // React 컴포넌트에서는 JSX.Element가 명확하므로 비활성화

      // 기본 규칙들
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off", // 개발 중에만 console 허용
      "prefer-const": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
