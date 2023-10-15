'use client';

import { cn } from '@/utils/tw';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLink: React.FC<{
  href: string;
  activeClassName?: string;
  inactiveClassName?: string;
  className?: string;
  children: any;
}> = ({ href, children, className, activeClassName, inactiveClassName }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      className={cn(className, isActive ? activeClassName : inactiveClassName)}
      href={href}
    >
      {children}
    </Link>
  );
};
export default NavLink;
