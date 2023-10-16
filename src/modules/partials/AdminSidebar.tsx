'use client';
import NavLink from '@/components/NavLink';
import useWindowSize from '@/hooks/useWindowSize';
import { cn } from '@/utils/tw';

import React, { useEffect, useState } from 'react';

const navLinks = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/product',
    label: 'Products',
  },
  {
    path: '/cart',
    label: 'Carts',
  },
];
const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const size = useWindowSize();
  return (
    <>
      {size && size.width >= 1185 && (
        <aside
          className={cn(
            'flex flex-col w-64 h-screen px-5 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l ',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col justify-between flex-1 mt-6">
            <nav className="-mx-3 space-y-3 ">
              {navLinks.map((navLink) => (
                <NavLink
                  href={navLink.path}
                  className="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg  hover:bg-gray-100  hover:text-gray-700"
                  key={crypto.randomUUID()}
                  activeClassName="text-main"
                >
                  <span className="mx-2 text-sm font-medium">
                    {navLink.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
      )}
    </>
  );
};

// export default useWindowSize;
export default AdminSidebar;
