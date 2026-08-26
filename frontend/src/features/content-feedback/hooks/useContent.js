import { useState, useEffect, useCallback } from 'react';
import { contentApi } from '../../../shared/api/contentApi';
import { categoryApi } from '../../../shared/api/categoryApi';

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
        contentApi.list().catch(() => []),
        categoryApi.fetchCategories().catch(() => [])
      ]);
      const contents = Array.isArray(contentRes) ? contentRes : (contentRes.data || []);
      const rawCats = Array.isArray(catRes) ? catRes : (catRes.data || []);
      const categories = rawCats.map(c => ({ ...c, type: 'danh_muc' }));
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
      await categoryApi.createCategory({ 
        ten_danh_muc: item.title || item.tieu_de, 
        mo_ta: item.content || item.noi_dung,
        hinh_anh_url: item.imageUrl || item.hinh_anh_url || null
      });
    } else {
      await contentApi.create(item);
    }
    await fetchList(true); // Background update
  };

  const update = async (id, item) => {
    if (item.type === 'danh_muc' || item.loai === 'danh_muc') {
      await categoryApi.updateCategory(id, { 
        ten_danh_muc: item.title || item.tieu_de, 
        mo_ta: item.content || item.noi_dung,
        hinh_anh_url: item.imageUrl !== undefined ? item.imageUrl : (item.hinh_anh_url !== undefined ? item.hinh_anh_url : null)
      });
    } else {
      await contentApi.update(id, item);
    }
    await fetchList(true); // Background update
  };

  const remove = async (id, itemType) => {
    if (itemType === 'danh_muc') {
      await categoryApi.deleteCategory(id);
    } else {
      await contentApi.delete(id);
    }
    await fetchList(true); // Background update
  };

  return { data, loading, isUpdating, error, create, update, remove, refetch: fetchList };
}
