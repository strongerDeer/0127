import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { firebaseStorage } from '../config';

/**
 * 프로필 이미지 업로드
 * @param file 업로드할 파일
 * @param userId 사용자 ID
 * @returns 업로드된 이미지 URL
 */
export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  try {
    // 파일 크기 체크 (5MB 제한)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('파일 크기는 5MB 이하여야 합니다');
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다');
    }

    // 파일 확장자 추출
    const extension = file.name.split('.').pop();
    const timestamp = Date.now();
    const filename = `${userId}_${timestamp}.${extension}`;

    // Storage 경로 설정
    const storageRef = ref(firebaseStorage, `profiles/${filename}`);

    // 파일 업로드
    await uploadBytes(storageRef, file);

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('이미지 업로드에 실패했습니다');
  }
}

/**
 * 이미지 파일 미리보기 URL 생성
 * @param file 이미지 파일
 * @returns 미리보기 URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * 미리보기 URL 해제 (메모리 관리)
 * @param url 해제할 URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url);
}
