import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '../../../shared/api/reviewApi';

export function useReview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const result = await reviewApi.list();
      setData(result.data.map(r => ({ ...r, type: 'danh_gia' })));
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
    await reviewApi.create(item);
    await fetchList(); // Refetch list
  };

  const remove = async (id) => {
    await reviewApi.delete(id);
    await fetchList();
  };

  return { data, loading, error, create, remove, refetch: fetchList };
}
