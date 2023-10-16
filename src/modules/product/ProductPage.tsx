'use client';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { Input, Table } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  ColumnType,
} from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useDebounce } from '@/hooks/useDebounce';

interface DataType {
  id: number;
  title: string;
  brand: string;
  description: string;
  price: number;
  category: string;
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

const ProductPage = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const searchDebounceValue = useDebounce(search, 1100);

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
      title: 'Product Name',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },

    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
  ];

  const fetchData = () => {
    setLoading(true);
    const modifiedTableParams = tableParams as TableSearchParams;
    modifiedTableParams.q = searchDebounceValue;
    const API_URL = searchDebounceValue
      ? 'https://dummyjson.com/products/search'
      : 'https://dummyjson.com/products';

    fetch(`${API_URL}?${qs.stringify(getProductParams(modifiedTableParams))}`)
      .then((res) => res.json())
      .then((results) => {
        setData(results.products);
        setLoading(false);
        setTableParams({
          ...modifiedTableParams,
          pagination: {
            ...modifiedTableParams.pagination,
            total: results.total,
          },
        });
      });
  };

  function handleSearch() {
    setLoading(true);
    const tableParamsSearch = tableParams as TableSearchParams;
    tableParamsSearch.q = searchDebounceValue;

    fetch(
      `https://dummyjson.com/products/search?${qs.stringify(
        getProductParams(tableParamsSearch)
      )}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results.products);
        tableParams.pagination!.current = 1;
        tableParams.pagination!.pageSize = 10;
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results.total,
          },
        });
      });
  }

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    handleSearch();
  }, [searchDebounceValue]);

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
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        style={{ marginBottom: 20 }}
        placeholder="Search Product"
      />
      <Table
        scroll={{ x: 1000 }}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange as () => void}
      />
    </>
  );
};

export default ProductPage;
