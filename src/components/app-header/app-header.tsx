import Link from 'next/link';
import Image from 'next/image';

import { AppHeaderAuth } from './app-header-auth';

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-50 border-b border-neutral-900 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
      <div className='mx-auto flex h-20 max-w-6xl items-center justify-between px-6'>
        <Link href='/' className='h-12 w-32'>
          <Image
            src='https://www.pulse-advertising.com/wp-content/themes/pulse/assets/images/pulse_logo_white.png'
            alt='Pulse Logo'
            width={125}
            height={43.5}
          />
        </Link>
        <div className='flex items-center gap-4'>
          <AppHeaderAuth />
        </div>
      </div>
    </header>
  );
};
