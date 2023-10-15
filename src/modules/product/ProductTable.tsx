'use client';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Product, Products } from '@/types/product';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table/data-table';
import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useTransition,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ProductTable: React.FC<{
  products: Products;
  pageCount: number;
}> = ({ products, pageCount }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  // useLayoutEffect(() => {
  //   if (localStorage.getItem('product-state') as string) {
  //     console.log('1');
  //     router.push(localStorage.getItem('product-state') as string);
  //   }
  // });
  // useEffect(() => {
  //   if (localStorage.getItem('product-state') as string) {
  //     router.push(localStorage.getItem('product-state') as string);
  //   }
  //   return;
  // }, [searchParams]);

  const columns = React.useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Product Name" />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'brand',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Brand" />
        ),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'category',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Category" />
        ),
        cell: (info) => info.getValue(),
      },
    ],
    [isPending]
  );
  return (
    <div>
      <DataTable
        columns={columns}
        data={products.products}
        pageCount={pageCount}
        // Render notion like filters

        // Render dynamic searchable filters
        searchableColumns={[
          {
            id: 'title',
            title: 'Something',
          },
        ]}
      />
    </div>
  );
};

export default ProductTable;
