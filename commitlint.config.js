module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 새 기능
        'fix',      // 버그 수정
        'refactor', // 리팩토링
        'style',    // 코드 포맷팅
        'docs',     // 문서
        'test',     // 테스트
        'chore',    // 빌드/설정
        'perf',     // 성능 개선
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']], // 제목은 소문자로 시작
    'subject-empty': [2, 'never'], // 제목 필수
    'type-empty': [2, 'never'], // 타입 필수
  },
};
