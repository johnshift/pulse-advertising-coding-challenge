'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

export const Table = ({
  className,
  ...props
}: React.ComponentProps<'table'>) => {
  return (
    <div
      data-slot='table-container'
      className='relative w-full overflow-x-auto'
    >
      <table
        data-slot='table'
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  );
};

export const TableHeader = ({
  className,
  ...props
}: React.ComponentProps<'thead'>) => {
  return (
    <thead
      data-slot='table-header'
      className={cn('[&_tr]:border-b', className)}
      {...props}
    />
  );
};

type TableBodyProps = React.ComponentProps<'tbody'> & {
  asChild?: boolean;
};

export const TableBody = ({
  className,
  asChild = false,
  ...props
}: TableBodyProps) => {
  const Comp = asChild ? Slot : 'tbody';
  return (
    <Comp
      data-slot='table-body'
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  );
};

export const TableFooter = ({
  className,
  ...props
}: React.ComponentProps<'tfoot'>) => {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  );
};

type TableRowProps = React.ComponentProps<'tr'> & {
  asChild?: boolean;
};

export const TableRow = ({
  className,
  asChild = false,
  ...props
}: TableRowProps) => {
  const Comp = asChild ? Slot : 'tr';
  return (
    <Comp
      data-slot='table-row'
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  );
};

export const TableHead = ({
  className,
  ...props
}: React.ComponentProps<'th'>) => {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
};

export const TableCell = ({
  className,
  ...props
}: React.ComponentProps<'td'>) => {
  return (
    <td
      data-slot='table-cell'
      className={cn(
        'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]',
        className,
      )}
      {...props}
    />
  );
};

export const TableCaption = ({
  className,
  ...props
}: React.ComponentProps<'caption'>) => {
  return (
    <caption
      data-slot='table-caption'
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
};
