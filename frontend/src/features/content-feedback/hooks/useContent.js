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
      const [contentRes, catRes] = await Promise.all([
        contentApi.list().catch(() => ({ data: [] })),
        contentApi.listCategories().catch(() => ({ data: [] }))
      ]);
      const contents = contentRes.data || [];
      const categories = catRes.data || [];
      setData([...contents, ...categories]);
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
    if (item.type === 'danh_muc' || item.loai === 'danh_muc') {
      await contentApi.createCategory({ ten_danh_muc: item.title || item.tieu_de, mo_ta: item.content || item.noi_dung });
    } else {
      await contentApi.create(item);
    }
    await fetchList(true); // Background update
  };

  const update = async (id, item) => {
    if (item.type === 'danh_muc' || item.loai === 'danh_muc') {
      await contentApi.updateCategory(id, { ten_danh_muc: item.title || item.tieu_de, mo_ta: item.content || item.noi_dung });
    } else {
      await contentApi.update(id, item);
    }
    await fetchList(true); // Background update
  };

  const remove = async (id, itemType) => {
    if (itemType === 'danh_muc') {
      await contentApi.deleteCategory(id);
    } else {
      await contentApi.delete(id);
    }
    await fetchList(true); // Background update
  };

  return { data, loading, isUpdating, error, create, update, remove, refetch: fetchList };
}
