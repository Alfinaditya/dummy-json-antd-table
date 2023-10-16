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

interface DataType {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
  column?: ColumnType<DataType>;
}
interface TableSearchParams extends TableParams {
  q: string;
}

const getProductParams = (params: TableSearchParams) => ({
  limit: params.pagination?.pageSize,
  skip: params.pagination
    ? (((params.pagination.pageSize as number) *
        (params.pagination.current as number)) as number) - 10
    : 0,
  q: params.q,
});

const ProductTable = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

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
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Product Name',
      dataIndex: 'title',

      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Price',
      dataIndex: 'price',

      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',

      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Total',
      dataIndex: 'total',

      sorter: (a, b) => a.total - b.total,
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    const modifiedTableParams = tableParams as TableSearchParams;
    modifiedTableParams.q = search;
    const API_URL = `https://dummyjson.com/carts/${params.id}`;
    const res = await fetch(
      `${API_URL}?${qs.stringify(getProductParams(modifiedTableParams))}`
    );
    const results = await res.json();
    setData(results.products);
    setLoading(false);
    setTableParams({
      ...modifiedTableParams,
      pagination: {
        ...modifiedTableParams.pagination,
        total: results.totalProducts,
      },
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
      <Table
        columns={columns}
        scroll={{ x: 1000 }}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange as () => void}
      />
    </>
  );
};

export default ProductTable;
