'use client';
import NavLink from '@/components/NavLink';
import useWindowSize from '@/hooks/useWindowSize';
import { ListBulletIcon } from '@/icons';
import { Drawer, DrawerProps } from 'antd';
import React, { useState } from 'react';
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
const Mobilesidebar = () => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('left');
  const size = useWindowSize();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      {size && size.width <= 1185 && (
        <div className="px-10 py-3">
          <div className="bg-main w-max p-3 rounded-xl focus-visible:outline-none active:bg-main/90">
            <ListBulletIcon
              onClick={showDrawer}
              className="text-white w-6 h-6"
            />
          </div>
          <Drawer
            placement={placement}
            width={500}
            onClose={onClose}
            open={open}
          >
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
          </Drawer>
        </div>
      )}
    </>
  );
};

export default Mobilesidebar;
