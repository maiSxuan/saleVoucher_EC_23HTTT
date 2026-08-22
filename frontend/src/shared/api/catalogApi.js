const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";
const CATALOG_CACHE_TTL_MS = 15_000;

const responseCache = new Map();
const pendingRequests = new Map();

function getCurrentLang() {
  return localStorage.getItem("app_lang") || "vi";
}

async function fetchCached(key, loader, ttlMs = CATALOG_CACHE_TTL_MS) {
  const cached = responseCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }

  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }

  const request = loader()
    .then((data) => {
      responseCache.set(key, { data, expiresAt: Date.now() + ttlMs });
      return data;
    })
    .finally(() => pendingRequests.delete(key));

  pendingRequests.set(key, request);
  return request;
}

export async function fetchSellingVouchers() {
  const lang = getCurrentLang();
  return fetchCached(`catalog:${lang}`, async () => {
    const res = await fetch(`${BASE_URL}/catalog?lang=${lang}`, {
      headers: { "Accept-Language": lang },
    });
    if (!res.ok) {
      // E1: Không thể truy xuất dữ liệu voucher
      throw new Error("Không thể tải danh sách voucher");
    }
    const json = await res.json();
    return json.data;
  });
}

export async function fetchCategories() {
  const lang = getCurrentLang();
  return fetchCached(`catalog-categories:${lang}`, async () => {
    const res = await fetch(`${BASE_URL}/catalog/categories?lang=${lang}`, {
      headers: { "Accept-Language": lang },
    });
    if (!res.ok) {
      throw new Error("Không thể tải danh mục");
    }
    const json = await res.json();
    return json.data; // [{ id, name }]
  });
}

export async function fetchVoucherDetail(id) {
  const lang = getCurrentLang();
  return fetchCached(`catalog-detail:${lang}:${id}`, async () => {
    const res = await fetch(`${BASE_URL}/catalog/${id}?lang=${lang}`, {
      headers: { "Accept-Language": lang },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Không thể tải thông tin voucher");
    const json = await res.json();
    return json.data;
  });
}

export async function fetchVoucherReviews(voucherId) {
  const res = await fetch(`${BASE_URL}/review/voucher/${voucherId}`);
  if (!res.ok) throw new Error("Không thể tải đánh giá voucher");
  const json = await res.json();
  return json.data || [];
}
