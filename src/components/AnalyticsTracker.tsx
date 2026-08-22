import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../lib/analytics';

/** Registra pageview first-party a cada mudança de rota (SPA). */
export function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    trackPageview(`${pathname}${search}`);
  }, [pathname, search]);

  return null;
}
