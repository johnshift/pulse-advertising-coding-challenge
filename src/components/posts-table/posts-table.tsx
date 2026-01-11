'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePosts } from '@/hooks/use-posts';
import { useDashboardStore } from '@/lib/stores/dashboard.store';
import { cn } from '@/lib/utils';

import { createColumns } from './posts-table-columns';
import { PostDetailDialog } from './post-detail-dialog';
import { PostsTablePagination } from './posts-table-pagination';
import {
  PostsTableEmpty,
  PostsTableError,
  PostsTableLoading,
} from './posts-table-states';
import { PostsTableToolbar } from './posts-table-toolbar';

export const PostsTable = () => {
  const {
    page,
    pageSize,
    sortField,
    sortDirection,
    platform,
    selectedPost,
    isPostDialogOpen,
    setPage,
    setPageSize,
    setSorting,
    setPlatform,
    resetFilters,
    openPostDialog,
    closePostDialog,
  } = useDashboardStore();

  const {
    data,
    isPending,
    isFetching,
    isError,
    refetch,
    totalPages,
    totalCount,
    currentPage,
    pageSize: limit,
  } = usePosts({
    page,
    pageSize,
    sortField,
    sortDirection,
    platform,
  });

  const columns = createColumns({
    sortField,
    sortDirection,
    onSort: setSorting,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  const columnCount = columns.length;

  return (
    <div className='w-full'>
      <h2 className='text-2xl font-bold tracking-tight'>Posts</h2>
      <p className='mb-4 text-sm text-muted-foreground'>
        View and analyze your content performance
      </p>
      <PostsTableToolbar platform={platform} onPlatformChange={setPlatform} />

      <div className='overflow-hidden rounded-md border'>
        <Table className='table-fixed'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.column.getSize() }}
                    className={cn(header.column.id !== 'post' && 'text-center')}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          {isPending ? (
            <PostsTableLoading columnCount={columnCount} rowCount={pageSize} />
          ) : isError ? (
            <PostsTableError
              columnCount={columnCount}
              rowCount={pageSize}
              onRetry={refetch}
            />
          ) : !data || data.length === 0 ? (
            <PostsTableEmpty
              columnCount={columnCount}
              rowCount={pageSize}
              platform={platform}
              onClearFilter={resetFilters}
            />
          ) : (
            <TableBody
              className={cn(
                'transition-opacity',
                isFetching && 'pointer-events-none opacity-50',
              )}
            >
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => openPostDialog(row.original)}
                  className='h-[53px] cursor-pointer'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      openPostDialog(row.original);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className={cn(cell.column.id !== 'post' && 'text-center')}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      <PostsTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        limit={limit}
        totalCount={totalCount}
        onPageChange={setPage}
        onLimitChange={setPageSize}
      />

      <PostDetailDialog
        post={selectedPost}
        open={isPostDialogOpen}
        onOpenChange={(open) => !open && closePostDialog()}
      />
    </div>
  );
};
