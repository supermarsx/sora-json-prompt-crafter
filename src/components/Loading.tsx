import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading: React.FC = () => (
  <div className="flex items-center justify-center p-4" role="status">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="sr-only">Loading...</span>
  </div>
);

export default Loading;
