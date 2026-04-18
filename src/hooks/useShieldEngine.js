import { useState, useEffect, useCallback } from 'react';
import { scanUrl, getMetrics } from '../services/apiClient';

const useShieldEngine = () => {
  const [isActive, setIsActive] = useState(true);
  const [scans, setScans] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleShield = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const performScan = useCallback(async (url) => {
    if (!isActive) return null;
    setLoading(true);
    try {
      const result = await scanUrl(url);
      setScans((prev) => [result, ...prev]);
      return result;
    } catch (error) {
      console.error('Scan failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isActive]);

  const refreshMetrics = useCallback(async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    }
  }, []);

  useEffect(() => {
    refreshMetrics();
  }, [refreshMetrics]);

  return {
    isActive,
    scans,
    metrics,
    loading,
    toggleShield,
    performScan,
    refreshMetrics,
  };
};

export default useShieldEngine;
