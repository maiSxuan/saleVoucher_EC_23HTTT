/**
 * Purpose: Service xử lý truy vấn catalog và voucher đang bán.
 */
const catalogRepository = require("../../data/repositories/catalog.repository");
const { computeAvailability } = require("./voucher-aivailability.util");
const NotFoundError = require("../../../../common/errors/NotFoundError");

function mapVoucher(v) {
  const originalPrice = Number(v.gia_goc);
  const discountAmount = Number(v.gia_tri_giam) || 0;
  const partner = v.voucher_cn?.[0]?.chinhanh?.hosodn?.ten_dn || "Đối tác";
  const branches = [
    ...new Set(
      (v.voucher_cn || [])
        .map((vc) => vc.chinhanh?.ten_chi_nhanh)
        .filter(Boolean),
    ),
  ];

  return {
    id: v.ma_voucher,
    name: v.ten_voucher,
    description: v.mo_ta,
    category: v.danh_muc?.ten_danh_muc || "Khác",
    partner,
    branches,
    image: v.hinh_anh_url || "https://placehold.co/800x400?text=Voucher",
    originalPrice,
    salePrice: originalPrice - discountAmount,
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
  async listCatalog() {
    const vouchers = await catalogRepository.findSellingVouchers();
    return vouchers.map(mapVoucher).filter((v) => v.availability === "selling"); // NFR-02.1
  }

  async listCategories() {
    const categories = await catalogRepository.findAllCategories();
    return categories.map((c) => ({ id: c.ma_danh_muc, name: c.ten_danh_muc }));
  }

  async getVoucherDetail(id) {
    const v = await catalogRepository.findVoucherById(id);
    if (!v) {
      // E1: Không thể truy xuất thông tin voucher
      throw new NotFoundError("Không tìm thấy voucher");
    }
    return mapVoucher(v);
  }
}

module.exports = new CatalogQueryService();
