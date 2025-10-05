import { ReactNode } from 'react';

import { Footer } from '@/widgets/Footer/ui/Footer';
import { Header } from '@/widgets/Header/ui/Header';

import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 전역 레이아웃 래퍼
 * Header + 메인 컨텐츠 + Footer 구조
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
