'use client';
import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { Button, Input, Table } from 'antd';
import type {
  ColumnsType,
  TablePaginationConfig,
  ColumnType,
} from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

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

const getProductParams = (params: TableParams) => ({
  limit: params.pagination?.pageSize,
  skip: params.pagination
    ? (((params.pagination.pageSize as number) *
        (params.pagination.current as number)) as number) - 10
    : 0,
  ...params,
});

const ProductTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [defaultSort, setDefaultSort] = useState<any>();
  useEffect(() => {
    setDefaultSort(
      localStorage.getItem('product-sort')
        ? JSON.parse(localStorage.getItem('product-sort') as string)
        : ''
    );
  }, []);

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  console.log(defaultSort);
  const columns: ColumnsType<DataType> = [
    {
      title: 'No',
      key: 'index',
      render: (text, record, index) => record.id,
      // sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Product Name',
      dataIndex: 'title',
      width: '20%',
      sorter: (a, b) => a.title.localeCompare(b.title),
      defaultSortOrder:
        defaultSort && defaultSort.index === 'title' && defaultSort.data,
      // defaultFilteredValue: ['titfdfdfdle'],
      // defaultSortOrder:(e)=>{}
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '20%',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      width: '20%',
      sorter: (a, b) => a.price - b.price,
    },

    {
      title: 'Category',
      dataIndex: 'category',
      width: '20%',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
  ];

  const fetchData = () => {
    setLoading(true);
    const modifiedTableParams = tableParams as TableSearchParams;
    modifiedTableParams.q = search;
    const API_URL = search
      ? 'https://dummyjson.com/products/search'
      : 'https://dummyjson.com/products';

    fetch(`${API_URL}?${qs.stringify(getProductParams(modifiedTableParams))}`)
      .then((res) => res.json())
      .then((results) => {
        setData(results.products);
        setLoading(false);
        if (
          modifiedTableParams.column?.dataIndex &&
          modifiedTableParams.column?.defaultSortOrder
        ) {
          localStorage.setItem(
            'product-sort',
            JSON.stringify({
              index: modifiedTableParams.column?.dataIndex,
              data: modifiedTableParams.column?.defaultSortOrder,
            })
          );
        }
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
    tableParamsSearch.q = search;

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
          // handleSearch(e.target.value);
        }}
        placeholder="Basic usage"
      />
      <Button onClick={handleSearch}>Submit</Button>
      <Table
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

export default ProductTable;
