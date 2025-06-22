
import Dashboard from "@/components/Dashboard";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = () => {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
};

export default Index;
