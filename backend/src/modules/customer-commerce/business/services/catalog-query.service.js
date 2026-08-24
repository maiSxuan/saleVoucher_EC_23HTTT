/**
 * Purpose: Service xử lý truy vấn catalog và voucher đang bán.
 */
const catalogRepository = require("../../data/repositories/catalog.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const NotFoundError = require("../../../../common/errors/NotFoundError");
const translationService = require("../../../../common/services/translation.service");

const CATEGORY_ACCENT_MAP = {
  "An uong": "Ẩm Thực & Nhà Hàng",
  "Lam dep": "Làm Đẹp & Spa",
  "Giai tri": "Giải Trí & Vui Chơi",
  "Du lich": "Du Lịch & Khách Sạn",
  "Giao duc": "Giáo Dục & Khóa Học",
  "Mua sam": "Mua Sắm & Bán Lẻ",
};

function formatCat(name) {
  if (!name) return "Khác";
  return CATEGORY_ACCENT_MAP[name] || name;
}

function mapVoucher(v) {
  const originalPrice = Number(v.gia_goc) || 0;
  const discountAmount = Number(v.gia_tri_giam) || 0;

  // Lấy danh sách chi nhánh
  const branches = (v.voucher_cn || [])
    .map((item) => item.chinhanh)
    .filter(Boolean)
    .map((b) => ({
      id: b.ma_chi_nhanh,
      name: b.ten_chi_nhanh,
      address: b.dia_chi,
      region: b.khu_vuc,
      status: b.trang_thai,
    }));

  // Lấy thông tin đối tác
  const firstBranch = (v.voucher_cn || [])[0]?.chinhanh;
  const hosodn = firstBranch?.hosodn;
  const partner = hosodn
    ? {
        id: hosodn.ma_hs,
        name: hosodn.ten_dn,
        taxCode: hosodn.ma_so_thue,
        address: hosodn.dia_chi,
        logo: hosodn.logo || null,
      }
    : null;

  return {
    id: v.ma_voucher,
    ma_voucher: v.ma_voucher,
    name: v.ten_voucher,
    ten_voucher: v.ten_voucher,
    description: v.mo_ta,
    category: formatCat(v.danh_muc?.ten_danh_muc),
    categoryRaw: v.danh_muc?.ten_danh_muc,
    categoryId: v.ma_danh_muc || v.danh_muc?.ma_danh_muc,
    ma_danh_muc: v.ma_danh_muc || v.danh_muc?.ma_danh_muc,
    ten_danh_muc: formatCat(v.danh_muc?.ten_danh_muc),
    partner,
    ten_dn: partner?.name || "Thương hiệu đối tác",
    logo_dn: partner?.logo,
    branches,
    image: v.hinh_anh_url || "https://placehold.co/800x400?text=Voucher",
    hinh_anh_url: v.hinh_anh_url,
    originalPrice,
    gia_goc: originalPrice,
    salePrice: discountAmount,
    gia_ban: discountAmount,
    totalQty: v.so_luong_phat_hanh,
    soldQty: v.so_luong_da_ban,
    startSaleDate: v.tg_bat_dau_ban,
    endSaleDate: v.tg_ket_thuc_ban,
    conditions: v.dieu_kien_ap_dung,
    cancellationPolicy: v.chinh_sach_hoan_huy,
    availability: computeAvailability(v),
  };
}

class CatalogQueryService {
  async listCatalog(query = {}) {
    const vouchers = await catalogRepository.findSellingVouchers();
    let mapped = vouchers
      .map(mapVoucher)
      .filter((v) => v.availability === "selling"); // NFR-02.1
    const lang = query?.lang;
    if (lang && lang.toLowerCase().startsWith("en")) {
      mapped = await translationService.translateVoucherFields(
        mapped,
        undefined,
        "en",
      );
    }
    return mapped;
  }

  async listCategories(query = {}) {
    const categories = await catalogRepository.findAllCategories();
    let mapped = categories.map((c) => ({
      id: c.ma_danh_muc,
      ma_danh_muc: c.ma_danh_muc,
      name: formatCat(c.ten_danh_muc),
      ten_danh_muc: c.ten_danh_muc,
    }));
    const lang = query?.lang;
    if (lang && lang.toLowerCase().startsWith("en")) {
      mapped = await translationService.translateCategoryFields(mapped, "en");
    }
    return mapped;
  }

  async getVoucherDetail(id, lang = null) {
    const v = await catalogRepository.findVoucherById(id);
    if (!v) {
      // E1: Không thể truy xuất thông tin voucher
      throw new NotFoundError("Không tìm thấy voucher");
    }
    let mapped = mapVoucher(v);
    if (lang && lang.toLowerCase().startsWith("en")) {
      mapped = await translationService.translateVoucherFields(
        mapped,
        undefined,
        "en",
      );
    }
    return mapped;
  }
}

module.exports = new CatalogQueryService();
