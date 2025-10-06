import type { FieldValue, Timestamp } from 'firebase/firestore';

import type { UserDocument } from '@/shared/types/user';

import styles from './UserProfileCard.module.scss';

interface UserProfileCardProps {
  user: UserDocument;
  isOwnProfile: boolean;
  onEditClick?: () => void;
}

/**
 * 사용자 프로필 카드 UI
 */
export function UserProfileCard({ user, isOwnProfile, onEditClick }: UserProfileCardProps) {
  const formatDate = (timestamp: Timestamp | FieldValue): string => {
    if (!timestamp) return '-';
    try {
      if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleDateString('ko-KR');
      }
      return '-';
    } catch {
      return '-';
    }
  };

  return (
    <div className={styles.card}>
      {/* 프로필 이미지 */}
      <div className={styles.imageWrapper}>
        <img src={user.photoURL || '/default-avatar.png'} alt={user.nickname} className={styles.profileImage} />
      </div>

      {/* 기본 정보 */}
      <div className={styles.info}>
        <h1 className={styles.nickname}>{user.nickname}</h1>
        <p className={styles.userId}>@{user.userId}</p>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
      </div>

      {/* 상세 정보 */}
      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>이메일</span>
          <span className={styles.value}>{user.email}</span>
        </div>

        {isOwnProfile && user.gender && (
          <div className={styles.detailItem}>
            <span className={styles.label}>성별</span>
            <span className={styles.value}>
              {user.gender === 'male' ? '남성' : user.gender === 'female' ? '여성' : '기타'}
            </span>
          </div>
        )}

        {isOwnProfile && user.birth && (
          <div className={styles.detailItem}>
            <span className={styles.label}>생년월일</span>
            <span className={styles.value}>{user.birth}</span>
          </div>
        )}

        <div className={styles.detailItem}>
          <span className={styles.label}>가입일</span>
          <span className={styles.value}>{formatDate(user.createdAt)}</span>
        </div>
      </div>

      {/* 프로필 수정 버튼 (본인만) */}
      {isOwnProfile && onEditClick && (
        <button onClick={onEditClick} className={styles.editButton}>
          프로필 수정
        </button>
      )}
    </div>
  );
}
