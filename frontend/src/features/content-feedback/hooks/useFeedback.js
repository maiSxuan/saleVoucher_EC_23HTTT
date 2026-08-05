import { useState, useEffect, useCallback } from 'react';
import { feedbackApi } from '../api/feedbackApi';

export function useFeedback() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const result = await feedbackApi.list();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const create = async (item) => {
    await feedbackApi.create(item);
    await fetchList(); // Refetch list
  };

  return { data, loading, error, create, refetch: fetchList };
}
