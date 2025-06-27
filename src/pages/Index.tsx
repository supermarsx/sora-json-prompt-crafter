import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = lazy(() => import('@/components/Dashboard'));

const Index = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
