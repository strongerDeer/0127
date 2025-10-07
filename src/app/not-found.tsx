'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import clsx from 'clsx';

import { outfit } from '@/shared/font';
import { Icon } from '@/shared/ui/Icon';

import { Button } from '@/shadcn/ui/button';

import styles from './not-found.module.scss';

export default function NotFound() {
  const router = useRouter();
  const nav = {
    back: () => router.back(),
    home: () => router.push('/'),
  };

  useEffect(() => {
    // 프리패칭
    router.prefetch('/');
  }, [router]);

  return (
    <div className={`minWrap ${styles.notFound}`}>
      <h2 className={clsx(outfit.className, styles.boldTitle)}>
        Not Found<span>.</span>
      </h2>
      <p className={styles.title}>페이지가 존재하지 않습니다.</p>
      <p className={styles.text}> 입력하신 주소가 정확한지 다시 한번 확인해 주세요!</p>
      <div className={clsx(styles.btns, 'btnsWrap')}>
        <Button onClick={nav.back} className='btn'>
          <Icon name='left' /> 이전 페이지
        </Button>
        <Button onClick={nav.home} className='btn solid'>
          <Icon name='home' /> 메인 페이지
        </Button>
      </div>
    </div>
  );
}
