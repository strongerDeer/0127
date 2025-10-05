'use client';

import { Layout } from '@/widgets/Layout/ui/Layout';

import { LoginButton } from '@/features/auth/ui/LoginButton';

import styles from './page.module.scss';

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        {/* 히어로 섹션 */}
        <section className={styles.hero}>
          <h1>당신만의 독서 기록을 시작하세요</h1>
          <p>AI 기반 도서 취향 분석으로 더 나은 독서 경험을</p>
          <LoginButton />
        </section>

        {/* 기능 소개 */}
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <h3>도서 검색</h3>
            <p>알라딘 API를 통한 방대한 도서 데이터베이스 검색</p>
          </div>
          <div className={styles.featureCard}>
            <h3>AI 분석</h3>
            <p>독서 패턴 분석으로 맞춤 도서 추천</p>
          </div>
          <div className={styles.featureCard}>
            <h3>소셜 기능</h3>
            <p>다른 독서가들과 생각을 공유하세요</p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
