'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;

type PostsTablePaginationProps = {
  currentPage: number;
  totalPages: number;
  limit: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
};

export const PostsTablePagination = ({
  currentPage,
  totalPages,
  limit,
  totalCount,
  onPageChange,
  onLimitChange,
}: PostsTablePaginationProps) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalCount);

  return (
    <div className='mt-4 flex flex-col gap-3 sm:h-10 sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
      <div className='flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start'>
        <span className='text-sm text-muted-foreground'>
          Show rows per page
        </span>
        <Select
          value={String(limit)}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger size='sm' className='w-fit'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end'>
        <span className='text-sm text-muted-foreground'>
          Showing {startItem}-{endItem} of {totalCount} posts
        </span>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            aria-label='Go to previous page'
          >
            <ChevronLeftIcon className='size-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => canGoNext && onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            aria-label='Go to next page'
          >
            <ChevronRightIcon className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  );
};
