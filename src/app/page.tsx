'use client';

import Link from 'next/link';
import Image from 'next/image';
import * as motion from 'motion/react-client';
import { BarChart3, Table, TrendingUp, Shield, ArrowRight } from 'lucide-react';

import { fadeUpVariant, staggerContainer } from '@/lib/motion';

const features = [
  {
    icon: Table,
    title: 'Posts Table',
    description: 'Sort and filter posts by platform with engagement metrics',
  },
  {
    icon: BarChart3,
    title: 'Daily Metrics',
    description: 'Visualize engagement trends with interactive charts',
  },
  {
    icon: TrendingUp,
    title: 'Summary Cards',
    description: 'Track total engagement, top posts, and trend indicators',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'Row-level security ensures complete data isolation',
  },
];

const featureItemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const featuresContainerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const Home = () => {
  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <motion.main
        className='flex w-full max-w-3xl flex-col items-center gap-16 bg-white px-8 py-16 sm:items-start sm:px-16 sm:py-32 dark:bg-black'
        variants={staggerContainer}
        initial='hidden'
        animate='visible'
      >
        <motion.div variants={fadeUpVariant}>
          <Image
            src='https://www.pulse-advertising.com/wp-content/themes/pulse/assets/images/pulse_logo_white.png'
            alt='Pulse Logo'
            width={188}
            height={64}
            className='invert dark:invert-0'
          />
        </motion.div>

        <motion.div
          className='flex flex-col items-center gap-6 text-center sm:items-start sm:text-left'
          variants={fadeUpVariant}
        >
          <h1 className='max-w-md text-3xl leading-10 font-semibold tracking-tight text-black dark:text-zinc-50'>
            Social Media Analytics Dashboard
          </h1>
          <p className='max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400'>
            Track your engagement metrics across{' '}
            <span className='font-medium text-zinc-950 dark:text-zinc-50'>
              Instagram
            </span>{' '}
            and{' '}
            <span className='font-medium text-zinc-950 dark:text-zinc-50'>
              TikTok
            </span>
            . View daily trends, top posts, and monitor your content
            performance.
          </p>
        </motion.div>

        <motion.div
          className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2'
          variants={featuresContainerVariant}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className='flex items-start gap-3'
              variants={featureItemVariant}
            >
              <feature.icon className='mt-0.5 h-5 w-5 shrink-0 text-zinc-400' />
              <div>
                <h3 className='font-medium text-zinc-900 dark:text-zinc-100'>
                  {feature.title}
                </h3>
                <p className='text-sm text-zinc-500 dark:text-zinc-400'>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUpVariant}>
          <Link
            className='group flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]'
            href='/dashboard'
          >
            Get Started
            <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
          </Link>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Home;
