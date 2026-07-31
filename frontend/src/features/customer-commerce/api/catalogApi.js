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
