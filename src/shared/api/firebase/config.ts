import { getAnalytics } from 'firebase/analytics';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, GoogleAuthProvider, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Functions, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// firebase 초기화
// [기존] const app = initializeApp(firebaseConfig);

// Next.js SSR 렌더링. window 객체 접근시 에러 발생
// 초기화된 앱이 있다면  초기화된 getApp 호출 / 없다면 초기화 시키기
const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

// analytics는 클라이언트 사이드에서만 초기화
let analytics = null;

if (typeof window !== 'undefined') {
  analytics = getAnalytics(firebaseApp);
}

// Firebase 서비스 인스턴스들
const firebaseAuth: Auth = getAuth(firebaseApp); // firebase auth 사용(구글 로그인)
const firebaseFirestore: Firestore = getFirestore(firebaseApp);
const firebaseFunctions: Functions = getFunctions(firebaseApp);

// Google Auth Provider
const googleAuthProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
  prompt: 'select_account',
});

// Firebase 연결 상태 확인
export const isFirebaseConnected = () => {
  try {
    return !!firebaseApp && !!firebaseAuth && !!firebaseFirestore;
  } catch {
    return false;
  }
};

export {
  analytics,
  firebaseAuth,
  firebaseFirestore,
  firebaseFunctions,
  googleAuthProvider,
};
