import { useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * Logs attempts to access unknown routes and redirects users
 * back to the application's root.
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname,
    );
  }, [location.pathname]);

  return <Navigate to="/" replace />;
};

export default NotFound;
