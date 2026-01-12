'use client';

import { Crown, Heart, MessageCircle, Share2 } from 'lucide-react';
import * as motion from 'motion/react-client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ImageLoader } from '@/components/ui/image-loader';
import { InstagramSVG } from '@/components/ui/svgs/instagram-svg';
import { TiktokSVG } from '@/components/ui/svgs/tiktok-svg';
import type { Post } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { hoverLift } from '@/lib/motion';

const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

const truncateCaption = (caption: string | null, maxLength = 60): string => {
  if (!caption) return 'No caption';
  if (caption.length <= maxLength) return caption;
  return caption.slice(0, maxLength) + '...';
};

type TopPostCardProps = {
  post: Post;
  onClick?: () => void;
};

export const TopPostCard = ({ post, onClick }: TopPostCardProps) => {
  const PlatformIcon = post.platform === 'tiktok' ? TiktokSVG : InstagramSVG;
  const totalEngagement =
    (post.likes ?? 0) + (post.comments ?? 0) + (post.shares ?? 0);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={hoverLift}
    >
      <Card
        className={cn(
          'relative h-full overflow-hidden border-emerald-500/20 bg-linear-to-br from-card to-emerald-500/5 md:col-span-2 lg:col-span-1 lg:gap-4',
          onClick && 'cursor-pointer',
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
        role={onClick ? 'button' : undefined}
      >
        <div className='absolute top-4 right-4 rounded-lg bg-emerald-500/10 p-2'>
          <Crown className='size-5 text-emerald-500' aria-hidden='true' />
        </div>
        <CardHeader className=''>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-medium text-muted-foreground'>
              Top Performing Post
            </p>
            <PlatformIcon className='size-4' aria-label={post.platform} />
          </div>
        </CardHeader>
        <CardContent>
          <div className='flex gap-4'>
            {post.thumbnail_url ? (
              <ImageLoader
                src={post.thumbnail_url.split(',')[0]}
                alt={truncateCaption(post.caption, 30)}
                width={80}
                height={80}
                className='size-20 rounded-lg object-cover ring-1 ring-border'
                containerClassName='size-20 flex-shrink-0 rounded-lg'
              />
            ) : (
              <div className='flex size-20 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border'>
                <span className='text-xs text-muted-foreground'>No image</span>
              </div>
            )}
            <div className='min-w-0 flex-1'>
              <p className='line-clamp-2 text-xs font-medium'>
                {truncateCaption(post.caption)}
              </p>
              <div className='mt-2.5 flex flex-wrap gap-3 text-xs text-muted-foreground'>
                {[
                  { icon: Heart, value: post.likes, label: 'likes' },
                  {
                    icon: MessageCircle,
                    value: post.comments,
                    label: 'comments',
                  },
                  { icon: Share2, value: post.shares, label: 'shares' },
                ].map(({ icon: Icon, value, label }) => (
                  <span key={label} className='flex items-center gap-1'>
                    <Icon className='size-3' aria-hidden='true' />
                    {formatCompactNumber(value ?? 0)}
                  </span>
                ))}
              </div>
              <p className='mt-2 text-xs font-semibold text-emerald-500'>
                {formatCompactNumber(totalEngagement)} total engagements
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const TopPostCardEmpty = () => {
  return (
    <motion.div whileHover={{ y: -4 }} transition={hoverLift}>
      <Card className='relative h-full overflow-hidden border-emerald-500/20 bg-linear-to-br from-card to-emerald-500/5 md:col-span-2 lg:col-span-1'>
        <div className='absolute top-4 right-4 rounded-lg bg-emerald-500/10 p-2'>
          <Crown className='size-5 text-emerald-500' aria-hidden='true' />
        </div>
        <CardHeader className='pb-3'>
          <p className='text-sm font-medium text-muted-foreground'>
            Top Performing Post
          </p>
        </CardHeader>
        <CardContent>
          <div className='flex h-20 items-center justify-center'>
            <p className='text-sm text-muted-foreground'>No posts yet</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
