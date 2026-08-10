import { useState, useEffect, useCallback } from 'react';
import { contentApi } from '../api/contentApi';

export function useContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (background = false) => {
    try {
      if (background) setIsUpdating(true);
      else setLoading(true);
      const result = await contentApi.list();
      setData(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      if (background) setIsUpdating(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const create = async (item) => {
    await contentApi.create(item);
    await fetchList(true); // Background update
  };

  const update = async (id, item) => {
    await contentApi.update(id, item);
    await fetchList(true); // Background update
  };

  const remove = async (id) => {
    await contentApi.delete(id);
    await fetchList(true); // Background update
  };

  return { data, loading, isUpdating, error, create, update, remove, refetch: fetchList };
}
