import { AppHeader } from '@/components/app-header/app-header';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

const DashboardPage = () => {
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />
      <DashboardContent />
    </div>
  );
};

export default DashboardPage;
