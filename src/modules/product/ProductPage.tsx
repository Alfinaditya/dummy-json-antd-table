import React from 'react';
import ProductTable from './ProductTable';
import * as z from 'zod';
import { Products } from '@/types/product';
interface IndexPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const searchParamsSchema = z.object({
  page: z.string().default('1'),
  per_page: z.string().default('10'),
  sort: z.string().optional(),
  title: z.string().optional(),
  search: z.string().optional(),
});

interface Props {
  column: string | undefined;
  order: string | undefined;
  limit: number;
  skip: number;
  title: string | undefined;
}

async function getData(params: Props) {
  const newParams = objectToSearchParams(params);
  if (newParams.has('title')) {
    newParams.delete('title');
    newParams.append('q', params.title as string);
  }
  const API_URL = params.title
    ? 'https://dummyjson.com/products/search'
    : 'https://dummyjson.com/products';
  const res = await fetch(`${API_URL}?${newParams.toString()}`);
  const item: Products = await res.json();
  return item;
}

const ProductPage = async ({ searchParams }: IndexPageProps) => {
  const { page, per_page, sort, title, search } =
    searchParamsSchema.parse(searchParams);
  const limit = typeof per_page === 'string' ? parseInt(per_page) : 10;
  const skip =
    typeof page === 'string'
      ? parseInt(page) > 0
        ? (parseInt(page) - 1) * limit
        : 0
      : 0;
  const [column, order] =
    typeof sort === 'string'
      ? (sort.split('.') as [undefined, 'asc' | 'desc' | undefined])
      : [];
  const products: Products = await getData({
    column,
    order,
    limit,
    skip,
    title,
  });

  const pageCount = Math.ceil(products.total / limit);
  return (
    <div>
      <ProductTable products={products} pageCount={pageCount} />
    </div>
  );
};

export default ProductPage;

function objectToSearchParams(paramsObject: {
  [key: string]: any;
}): URLSearchParams {
  return new URLSearchParams(
    Object.entries(paramsObject)
      .filter(([_, value]) => value !== undefined)
      .reduce((accum, [key, value]) => {
        accum.append(key, value);
        return accum;
      }, new URLSearchParams())
  );
}
