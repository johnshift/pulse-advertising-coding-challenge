'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Platform } from '@/lib/types';

type PostsTableToolbarProps = {
  platform: Platform | null;
  onPlatformChange: (platform: Platform | null) => void;
};

const platformOptions: { value: Platform | null; label: string }[] = [
  { value: null, label: 'All' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
];

export const PostsTableToolbar = ({
  platform,
  onPlatformChange,
}: PostsTableToolbarProps) => {
  return (
    <div className='flex items-center gap-2 pb-4'>
      <span className='text-sm text-muted-foreground'>Platform:</span>
      <div className='flex gap-1'>
        {platformOptions.map((option) => (
          <Button
            key={option.label}
            variant={platform === option.value ? 'default' : 'outline'}
            size='sm'
            onClick={() => onPlatformChange(option.value)}
            className={cn(platform === option.value && 'pointer-events-none')}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
