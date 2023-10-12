import React from 'react';

async function getData() {
  return (await fetch('https://dummyjson.com/products')).json();
}

const ProductPage = async () => {
  const products = await getData();
  console.log(products);
  return <div></div>;
};

export default ProductPage;
