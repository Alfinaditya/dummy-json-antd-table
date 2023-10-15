import React from 'react';
async function getCartDetail(id: string) {
  return (await fetch(`https://dummyjson.com/carts/${id}`)).json();
}

const CartDetailsPage = async ({ params }: { params: { id: string } }) => {
  const cartDetails = await getCartDetail(params.id);
  console.log(cartDetails);
  return <div>CartDetailsPage</div>;
};

export default CartDetailsPage;
