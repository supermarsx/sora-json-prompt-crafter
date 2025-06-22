
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const Dashboard = lazy(() => import("@/components/Dashboard"));

const Index = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Index;
