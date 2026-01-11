'use client';

import { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

type ImageLoaderProps = Omit<ImageProps, 'onLoad' | 'alt'> & {
  alt?: string;
  containerClassName?: string;
};

export const ImageLoader = ({
  containerClassName,
  className,
  alt = '',
  ...props
}: ImageLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imgRef.current?.complete) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
    }
  }, []);

  return (
    <div className={cn('relative overflow-hidden', containerClassName)}>
      {isLoading && <div className='absolute inset-0 animate-pulse bg-muted' />}
      <Image
        {...props}
        ref={imgRef}
        alt={alt}
        className={cn(
          'transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100',
          className,
        )}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
