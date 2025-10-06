import { LoginButton } from '@/features/auth/ui/LoginButton';

import styles from './page.module.scss';

export default function LoginPage() {
  return (
    <div className={styles.minWrap}>
      <h2 className={styles.title}>안녕하세요: )</h2>
      <p className={styles.subTitle}>
        오늘, <strong>당신의 첫 페이지</strong>를 <wbr />
        시작해보세요.
      </p>

      {/* Google 로그인 버튼 */}
      <LoginButton />

      {/* 에러 메시지 */}
    </div>
  );
}
