import { Footer } from '@/widgets/Footer/ui/Footer';
import { Header } from '@/widgets/Header/ui/Header';

import { Toaster } from '@/shadcn/ui/sonner';

import styles from './Layout.module.scss';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}
