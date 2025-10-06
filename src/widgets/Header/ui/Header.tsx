'use client';

import Link from 'next/link';

import { Search, User } from 'lucide-react';

import { useAuth } from '@/features/auth/model/useAuth';
import { LoginButton } from '@/features/auth/ui/LoginButton';
import { LogoutButton } from '@/features/auth/ui/LogoutButton';

import { Button } from '@/shadcn/ui/button';

import styles from './Header.module.scss';

/**
 * 전역 헤더 컴포넌트
 */
export function Header() {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* 로고 */}
        <Link href='/' className={styles.logo}>
          <span className={styles.logoText}>0127.</span>
        </Link>

        {/* 네비게이션 */}
        <nav className={styles.nav}>
          <Link href='/search' className={styles.navLink}>
            <Search className={styles.navIcon} /> 도서 검색
          </Link>
          <Link href='/my-books' className={styles.navLink}>
            내 서재
          </Link>
          <Link href='/social' className={styles.navLink}>
            소셜
          </Link>
        </nav>

        {/* 사용자 영역 */}
        <div className={styles.userArea}>
          {user ? (
            <div className={styles.userInfo}>
              <Link href='/profile'>
                <Button variant='ghost' size='sm'>
                  <User className='h-4 w-4' />
                  {user.nickname}
                </Button>
              </Link>
              <LogoutButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </header>
  );
}
