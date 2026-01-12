'use client';

import {
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  Users,
  Play,
} from 'lucide-react';

import type { Post } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageLoader } from '@/components/ui/image-loader';

type PostDetailDialogProps = {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type StatItemProps = {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  isPercentage?: boolean;
};

const StatItem = ({ icon, label, value, isPercentage }: StatItemProps) => {
  const formattedValue = isPercentage
    ? `${(value ?? 0).toFixed(2)}%`
    : (value ?? 0).toLocaleString();

  return (
    <div className='flex items-center gap-3 rounded-lg border bg-muted/30 p-3'>
      <div className='flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary'>
        {icon}
      </div>
      <div>
        <p className='text-sm text-muted-foreground'>{label}</p>
        <p className='text-lg font-semibold'>{formattedValue}</p>
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const statItems = [
  { icon: Heart, label: 'Likes', key: 'likes' as const },
  { icon: MessageCircle, label: 'Comments', key: 'comments' as const },
  { icon: Share2, label: 'Shares', key: 'shares' as const },
  { icon: Bookmark, label: 'Saves', key: 'saves' as const },
  { icon: Eye, label: 'Impressions', key: 'impressions' as const },
  { icon: Users, label: 'Reach', key: 'reach' as const },
];

const PostMediaContent = ({ post }: { post: Post }) => {
  if (post.media_type === 'video') {
    return (
      <a
        href={post.permalink ?? 'https://youtube.com/watch?v=xvFZjo5PgG0'}
        target='_blank'
        rel='noopener noreferrer'
        className='group relative block'
      >
        <ImageLoader
          src={post.thumbnail_url ?? ''}
          fill
          sizes='(max-width: 672px) 100vw, 600px'
          containerClassName='aspect-video w-full rounded-lg'
          className='object-cover'
        />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='flex size-16 items-center justify-center rounded-full bg-black/60 transition-transform group-hover:scale-110'>
            <Play className='size-8 fill-white text-white' />
          </div>
        </div>
      </a>
    );
  }

  if (post.media_type === 'carousel' && post.thumbnail_url) {
    const imageUrls = post.thumbnail_url.split(',');
    return (
      <Carousel className='w-full'>
        <CarouselContent>
          {imageUrls.map((url, index) => (
            <CarouselItem key={index}>
              <ImageLoader
                src={url.trim()}
                fill
                sizes='(max-width: 672px) 100vw, 600px'
                containerClassName='aspect-video w-full rounded-lg'
                className='object-cover'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-2 bg-black/30! backdrop-blur-sm' />
        <CarouselNext className='right-2 bg-black/30! backdrop-blur-sm hover:bg-background' />
      </Carousel>
    );
  }

  if (post.thumbnail_url) {
    return (
      <ImageLoader
        src={post.thumbnail_url}
        fill
        sizes='(max-width: 672px) 100vw, 600px'
        containerClassName='aspect-video w-full rounded-lg'
        className='object-cover'
      />
    );
  }

  return (
    <div className='flex aspect-video w-full items-center justify-center rounded-lg bg-muted'>
      <span className='text-sm text-muted-foreground'>No image</span>
    </div>
  );
};

export const PostDetailDialog = ({
  post,
  open,
  onOpenChange,
}: PostDetailDialogProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className='bg-background/5 backdrop-blur-xs' />
      <DialogContent
        className='max-w-2xl'
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span className='capitalize'>{post.platform}</span>
            <span className='text-muted-foreground'>·</span>
            <span className='text-sm font-normal text-muted-foreground'>
              {formatDate(post.posted_at)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='space-y-3'>
            <PostMediaContent post={post} />
            <p className='text-sm text-muted-foreground'>
              {post.caption || 'No caption'}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
            {statItems.map(({ icon: Icon, label, key }) => (
              <StatItem
                key={key}
                icon={<Icon className='size-5' />}
                label={label}
                value={post[key]}
              />
            ))}
          </div>

          <div className='flex items-center justify-between border-t pt-4'>
            <div className='text-sm'>
              <span className='text-muted-foreground'>Engagement Rate: </span>
              <span className='font-semibold'>
                {(post.engagement_rate ?? 0).toFixed(2)}%
              </span>
            </div>
            <Button asChild>
              <a
                href={post.permalink ?? ''}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='size-4' />
                View on Platform
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
