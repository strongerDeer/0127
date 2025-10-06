import { serverTimestamp } from 'firebase/firestore';

import { userRepository } from '@/shared/api';

import type { CreateUserData } from '../types/joinForm';

export class UserApiError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'UserApiError';
  }
}

/**
 * 사용자 ID 중복 체크
 */
export async function checkUserIdAvailable(userId: string): Promise<boolean> {
  try {
    const exists = await userRepository.checkUserIdExists(userId);
    return !exists;
  } catch {
    throw new UserApiError('사용자 ID 중복 체크에 실패했습니다');
  }
}

/**
 * 닉네임 중복 체크
 */
export async function checkNicknameAvailable(nickname: string): Promise<boolean> {
  try {
    const exists = await userRepository.checkNicknameExists(nickname);
    return !exists;
  } catch {
    throw new UserApiError('닉네임 중복 체크에 실패했습니다');
  }
}

/**
 * 새 사용자 생성 (회원가입)
 */
export async function createUser(firebaseUid: string, userData: CreateUserData): Promise<void> {
  try {
    // 1. 사용자 ID 중복 체크
    const isUserIdAvailable = await checkUserIdAvailable(userData.userId);
    if (!isUserIdAvailable) {
      throw new UserApiError('이미 사용 중인 아이디입니다', 'USER_ID_TAKEN');
    }

    // 2. 닉네임 중복 체크
    const isNicknameAvailable = await checkNicknameAvailable(userData.nickname);
    if (!isNicknameAvailable) {
      throw new UserApiError('이미 사용 중인 닉네임입니다', 'NICKNAME_TAKEN');
    }

    // 3. 사용자 생성
    await userRepository.create(userData.userId, {
      userId: userData.userId,
      uid: firebaseUid,
      nickname: userData.nickname,
      email: userData.email,
      photoURL: userData.photoURL,
      bio: userData.bio,
      birth: userData.birth,
      gender: userData.gender,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    if (error instanceof UserApiError) {
      throw error;
    }

    throw new UserApiError('사용자 생성에 실패했습니다');
  }
}
