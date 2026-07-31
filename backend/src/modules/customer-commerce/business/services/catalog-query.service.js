/**
 * Purpose: Service xử lý truy vấn catalog và voucher đang bán.
 */
const catalogRepository = require("../../data/repositories/catalog.repository");

class CatalogQueryService {
  async listCatalog() {
    const vouchers = await catalogRepository.findSellingVouchers();

    // E2: nếu map dữ liệu lỗi thì để lỗi rơi xuống controller -> next(error)
    return vouchers.map((v) => {
      const originalPrice = Number(v.gia_goc);
      const discountAmount = Number(v.gia_tri_giam) || 0;
      const partner = v.voucher_cn?.[0]?.chinhanh?.hosodn?.ten_dn || "Đối tác";

      return {
        id: v.ma_voucher,
        name: v.ten_voucher,
        description: v.mo_ta,
        category: v.danh_muc?.ten_danh_muc || "Khác",
        partner,
        image: v.hinh_anh_url || "https://placehold.co/400x300?text=Voucher",
        originalPrice,
        salePrice: originalPrice - discountAmount,
        totalQty: v.so_luong_phat_hanh,
        soldQty: v.so_luong_da_ban,
        endSaleDate: v.tg_ket_thuc_ban,
        availability: "selling",
      };
    });
  }

  async listCategories() {
    const categories = await catalogRepository.findAllCategories();
    return categories.map((c) => ({ id: c.ma_danh_muc, name: c.ten_danh_muc }));
  }
}

module.exports = new CatalogQueryService();
