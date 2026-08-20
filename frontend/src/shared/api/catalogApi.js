const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function getCurrentLang() {
  return localStorage.getItem("app_lang") || "vi";
}

export async function fetchSellingVouchers() {
  const lang = getCurrentLang();
  const res = await fetch(`${BASE_URL}/catalog?lang=${lang}`, {
    headers: { "Accept-Language": lang },
  });
  if (!res.ok) {
    // E1: Không thể truy xuất dữ liệu voucher
    throw new Error("Không thể tải danh sách voucher");
  }
  const json = await res.json();
  return json.data;
}

export async function fetchCategories() {
  const lang = getCurrentLang();
  const res = await fetch(`${BASE_URL}/catalog/categories?lang=${lang}`, {
    headers: { "Accept-Language": lang },
  });
  if (!res.ok) {
    throw new Error("Không thể tải danh mục");
  }
  const json = await res.json();
  return json.data; // [{ id, name }]
}

export async function fetchVoucherDetail(id) {
  const lang = getCurrentLang();
  const res = await fetch(`${BASE_URL}/catalog/${id}?lang=${lang}`, {
    headers: { "Accept-Language": lang },
  });
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
