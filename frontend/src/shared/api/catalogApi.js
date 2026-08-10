const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function fetchSellingVouchers() {
  const res = await fetch(`${BASE_URL}/catalog`);
  if (!res.ok) {
    // E1: Không thể truy xuất dữ liệu voucher
    throw new Error("Không thể tải danh sách voucher");
  }
  const json = await res.json();
  return json.data;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/catalog/categories`);
  if (!res.ok) {
    throw new Error("Không thể tải danh mục");
  }
  const json = await res.json();
  return json.data; // [{ id, name }]
}

export async function fetchVoucherDetail(id) {
  const res = await fetch(`${BASE_URL}/catalog/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Không thể tải thông tin voucher");
  const json = await res.json();
  return json.data;
}

export async function fetchVoucherReviews(voucherId) {
  const res = await fetch(`${BASE_URL}/review/voucher/${voucherId}`);
  if (!res.ok) throw new Error("Không thể tải đánh giá voucher");
  const json = await res.json();
  return json.data || [];
}
