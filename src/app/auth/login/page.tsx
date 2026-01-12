import { LoginForm } from '@/components/auth/login-form';

export default function Page() {
  return (
    <div className='flex min-h-svh w-full items-center justify-center bg-zinc-50 p-6 md:p-10 dark:bg-black'>
      <div className='w-full max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
}
