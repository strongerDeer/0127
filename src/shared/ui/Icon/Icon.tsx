import { Check, ChevronLeft, ChevronRight, Image, LogIn, LogOut, Menu, Plus, Search, User, X } from 'lucide-react';

export type IconName =
  | 'image'
  | 'user'
  | 'login'
  | 'logout'
  | 'menu'
  | 'close'
  | 'search'
  | 'plus'
  | 'check'
  | 'chevron-right'
  | 'chevron-left';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  color?: string;
}

const iconMap = {
  image: Image,
  user: User,
  login: LogIn,
  logout: LogOut,
  menu: Menu,
  close: X,
  search: Search,
  plus: Plus,
  check: Check,
  'chevron-right': ChevronRight,
  'chevron-left': ChevronLeft,
};

/**
 * lucide-react 아이콘 통합 관리 컴포넌트
 * @param name 아이콘 이름
 * @param size 아이콘 크기 (기본값: 24)
 * @param className 추가 CSS 클래스
 * @param color 아이콘 색상
 */
export function Icon({ name, size = 24, className, color }: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} className={className} color={color} />;
}
