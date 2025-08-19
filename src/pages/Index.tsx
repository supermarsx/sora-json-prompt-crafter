import { lazy, Suspense } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

const Dashboard = lazy(() => import('@/components/Dashboard'));

/**
 * Bootstraps the application and lazy-loads the `Dashboard` component
 * to keep the initial bundle lightweight.
 */
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
