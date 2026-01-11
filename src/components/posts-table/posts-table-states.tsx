'use client';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Platform } from '@/lib/types';

type LoadingStateProps = {
  columnCount: number;
  rowCount: number;
};

export const PostsTableLoading = ({
  columnCount,
  rowCount,
}: LoadingStateProps) => {
  return (
    <TableBody>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className='h-[53px]'>
          {Array.from({ length: columnCount }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <div
                className={cn(
                  'animate-pulse rounded bg-muted',
                  cellIndex === 0 ? 'h-10 w-48' : 'h-4 w-16',
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

type EmptyStateProps = {
  columnCount: number;
  rowCount: number;
  platform: Platform | null;
  onClearFilter?: () => void;
};

export const PostsTableEmpty = ({
  columnCount,
  rowCount,
  platform,
  onClearFilter,
}: EmptyStateProps) => {
  const isFiltered = platform !== null;
  const minHeight = rowCount * 53;

  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columnCount}
          className='text-center'
          style={{ height: minHeight }}
        >
          <div className='flex flex-col items-center gap-2'>
            {isFiltered ? (
              <>
                <p className='text-muted-foreground'>
                  No posts found for {platform}.
                </p>
                <p className='text-sm text-muted-foreground'>
                  Try selecting a different platform or clear the filter.
                </p>
                {onClearFilter && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={onClearFilter}
                    className='mt-2'
                  >
                    Clear filter
                  </Button>
                )}
              </>
            ) : (
              <>
                <p className='text-muted-foreground'>
                  You don&apos;t have any posts yet.
                </p>
                <p className='text-sm text-muted-foreground'>
                  Once you publish content, your posts will appear here.
                </p>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

type ErrorStateProps = {
  columnCount: number;
  rowCount: number;
  onRetry?: () => void;
};

export const PostsTableError = ({
  columnCount,
  rowCount,
  onRetry,
}: ErrorStateProps) => {
  const minHeight = rowCount * 53;

  return (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={columnCount}
          className='text-center'
          style={{ height: minHeight }}
        >
          <div className='flex flex-col items-center gap-2'>
            <p className='text-muted-foreground'>
              We couldn&apos;t load your posts right now.
            </p>
            <p className='text-sm text-muted-foreground'>
              Please try again in a moment.
            </p>
            {onRetry && (
              <Button
                variant='outline'
                size='sm'
                onClick={onRetry}
                className='mt-2'
              >
                Try again
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
