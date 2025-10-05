import Link from 'next/link';

import { Mail } from 'lucide-react';

import styles from './Footer.module.scss';

/**
 * 전역 푸터 컴포넌트
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* 서비스 소개 */}
          <div className={styles.section}>
            <h3>BookLog</h3>
            <p>
              AI 기반 도서 취향 분석 플랫폼
              <br />
              당신만의 독서 기록을 시작하세요
            </p>
          </div>

          {/* 링크 */}
          <div className={styles.section}>
            <h3>바로가기</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href='/search'>도서 검색</Link>
              </li>
              <li>
                <Link href='/my-books'>내 서재</Link>
              </li>
              <li>
                <Link href='/social'>소셜</Link>
              </li>
            </ul>
          </div>

          {/* 연락처 */}
          <div className={styles.section}>
            <h3>Contact</h3>
            <div className={styles.contactLinks}>
              <a href='mailto:dreamfulbud@example.com'>
                <Mail />
              </a>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} BookLog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
