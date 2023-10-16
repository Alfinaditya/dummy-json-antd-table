'use client';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { Table } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  ColumnType,
} from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import Link from 'next/link';

interface DataType {
  id: number;
  total: number;
  totalProducts: number;
  totalQuantity: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
  column?: ColumnType<DataType>;
}

const getCartParams = (params: TableParams) => ({
  limit: params.pagination?.pageSize,
  skip: params.pagination
    ? (((params.pagination.pageSize as number) *
        (params.pagination.current as number)) as number) - 10
    : 0,
  // ...params,
});

const CartTable = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  // console.log(defaultSort);
  const columns: ColumnsType<DataType> = [
    {
      title: 'No',
      key: 'id',
      render: (text, record, index) => record.id,
      // sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Total Products',
      dataIndex: 'totalProducts',

      // sorter: (a, b) => a.totalProducts.localeCompare(b.totalProducts),
      sorter: (a, b) => a.totalProducts - b.totalProducts,
    },
    {
      title: 'Total Quantity',
      dataIndex: 'totalQuantity',

      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
    },
    {
      title: 'Total',
      dataIndex: 'total',

      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Actions',
      key: 'id',

      render: (text, record, index) => (
        <Link legacyBehavior href={`/cart/${record.id}`}>
          <a>See Products</a>
        </Link>
      ),
      // render: (text,cor) => <a>{text}</a>,
    },
  ];

  const fetchData = () => {
    setLoading(true);
    const API_URL = 'https://dummyjson.com/carts';
    console.log(tableParams);
    // console.log(`${API_URL}?${qs.stringify(getCartParams(tableParams))}`);
    fetch(`${API_URL}?${qs.stringify(getCartParams(tableParams))}`)
      .then((res) => res.json())
      .then((results) => {
        setData(results.carts);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.total,
          },
        });
      });
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue>,
    sorter: SorterResult<DataType>,
    column: ColumnType<DataType>
  ) => {
    setTableParams({
      pagination,
      filters,
      column: column,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  return (
    <>
      {/* <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          // handleSearch(e.target.value);
        }}
        placeholder="Basic usage"
      />
      <Button onClick={handleSearch}>Submit</Button> */}
      <Table
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        scroll={{ x: 1000 }}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange as () => void}
      />
    </>
  );
};

export default CartTable;
