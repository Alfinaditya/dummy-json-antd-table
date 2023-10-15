import { Carts } from '@/types/carts';
import React from 'react';
import CartTable from './CartTable';
// async function getData() {
//   return (await fetch('https://dummyjson.com/carts')).json();
// }

interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
const CartPage = async ({ searchParams }: IndexPageProps) => {
  // const carts: Carts = await getData();
  const { page, per_page, sort, title, brand, price, stock, category } =
    searchParams;
  return <div>{/* <CartTable items={carts} /> */}</div>;
};

export default CartPage;
