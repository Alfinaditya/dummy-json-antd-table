'use client';

import React, { useState } from 'react';
import {
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
// import Input from './Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';
import { Button } from './Button';
import Input from './Input';
import { ChevronDownIcon, ChevronUpDownIcon, ChevronUpIcon } from '@/icons';
interface Props {
  data: any;
  columns: any[];
}
const Table: React.FC<Props> = ({ data, columns }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
      itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
  };
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <>
      <div className="flex justify-between mb-7">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Show 5 rows" />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                Show {pageSize} rows
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="w-64"
          type="search"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
        />
      </div>
      <>
        <table className="w-full text-left border">
          <thead className="border text-xs text-gray-700 uppercase">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr
                  className="bg-main border-b hover:bg-main/90"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap border"
                        key={header.id}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none flex items-center'
                                : 'flex items-center',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            <p className="mr-2">
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </p>
                            {header.column.getIsSorted() === 'desc' ? (
                              <ChevronUpIcon />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ChevronDownIcon />
                            ) : (
                              <ChevronUpDownIcon />
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            <>
              {table.getRowModel().rows.map((row) => (
                <tr className="bg-white hover:bg-gray-50" key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        className="bg-white hover:bg-gray-50 border px-6 py-4"
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </>
          </tbody>
        </table>
        <div>
          <span className="flex items-center gap-1 my-4">
            Go to page
            <Input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="ml-3 border p-1 rounded w-16"
            />
          </span>
          <div className="flex justify-between items-center">
            <div>
              <p>
                Showing{' '}
                <span className="text-main font-semibold">
                  {table.getPrePaginationRowModel().rows.length} Rows{' '}
                </span>
              </p>
              <p className="mt-1">
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </p>
            </div>
            <div>
              <Button
                className="ml-2"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </Button>
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="mx-3"
              >
                Previous
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
              <Button
                className="ml-3"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

// const skeletonKeyframes = keyframes`
//   0% {
//     background-position: -200px 0;
//   }
//   100% {
//     background-position: calc(200px + 100%) 0;
//   }
// `;

/* const CellSkeleton = styled.div`
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: 4px;
  animation: ${skeletonKeyframes} 1300ms ease-in-out infinite;
  background-image: linear-gradient(90deg, #eee, #f5f5f5, #eee);
  background-color: #eee;
  margin-bottom: 16px;
  width: 80px;
  height: 15px;
  margin: auto;
  max-height: 150px;
  max-width: 150px;
  display: block;
`; */

/* const Th = styled.th`
  background: ${color.primary};
  font-weight: 500;
  div {
    color: ${color.light};
  }
`;
const Tr = styled.tr<{ isLoading: boolean }>`
  &:nth-of-type(odd) {
    background-color: ${(p) => !p.isLoading && '#efefef'};
  }
  /* &:hover {
    background-color: lightpink;
  } */
`; */

// const Container = styled.div`;
//   /* background: green; */
//   margin-top: 15px;
// `;

// const StyledTable = styled.table`
//   width: 100%;
//   overflow-x: scroll;
//   th {
//     padding: 5px;
//   }
//   td {
//     padding: 5px;
//   }
// `;

// const StyledInput = styled(Input)`
//   margin-left: auto;
//   margin-bottom: 15px;
// `;

// const PaginationButtons = styled.div`
//   display: flex;
// `;

// const Pages = styled.p`
//   margin-top: 5px;
// `;

// const StyledPrevNextAllButton = styled(Button)`
//   padding: 10px;
//   /* margin-right: 10px; */
// `;

// const BottomActionButtons = styled.div`
//   display: flex;
//   justify-content: space-between;
//   margin-top: 15px;
// `;

export default Table;
