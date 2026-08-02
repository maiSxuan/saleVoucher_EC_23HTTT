const supabase = require("../../../../config/supabase");
const VoucherBranchModel = require("../models/voucher-branch.model");

// In-memory fallback dataset for voucher_cn
let SEED_VOUCHER_CN = [
  { ma_voucher: "50000000-0000-0000-0000-000000000001", ma_chi_nhanh: "30000000-0000-0000-0000-000000000001" },
  { ma_voucher: "50000000-0000-0000-0000-000000000001", ma_chi_nhanh: "30000000-0000-0000-0000-000000000002" },
  { ma_voucher: "50000000-0000-0000-0000-000000000002", ma_chi_nhanh: "30000000-0000-0000-0000-000000000004" },
];

class VoucherBranchRepository {
  /**
   * List branch links by voucher ID
   */
  async getBranchesByVoucherId(voucherId) {
    try {
      const { data, error } = await supabase
        .from("voucher_cn")
        .select("ma_chi_nhanh")
        .eq("ma_voucher", voucherId);

      if (error || !data || data.length === 0) {
        return SEED_VOUCHER_CN.filter((item) => item.ma_voucher === voucherId).map(
          (item) => new VoucherBranchModel(item)
        );
      }

      return data.map((item) => new VoucherBranchModel({ ma_voucher: voucherId, ma_chi_nhanh: item.ma_chi_nhanh }));
    } catch (e) {
      return SEED_VOUCHER_CN.filter((item) => item.ma_voucher === voucherId).map(
        (item) => new VoucherBranchModel(item)
      );
    }
  }

  /**
   * Set applicable branch links for a voucher
   */
  async setBranchesForVoucher(voucherId, branchIds = []) {
    try {
      // 1. Clear existing links
      await supabase.from("voucher_cn").delete().eq("ma_voucher", voucherId);

      // 2. Insert new links
      if (branchIds.length > 0) {
        const rows = branchIds.map((bId) => ({ ma_voucher: voucherId, ma_chi_nhanh: bId }));
        await supabase.from("voucher_cn").insert(rows);
      }
    } catch (e) {
      // In-memory fallback
      SEED_VOUCHER_CN = SEED_VOUCHER_CN.filter((item) => item.ma_voucher !== voucherId);
      branchIds.forEach((bId) => {
        SEED_VOUCHER_CN.push({ ma_voucher: voucherId, ma_chi_nhanh: bId });
      });
    }

    return branchIds.map((bId) => new VoucherBranchModel({ ma_voucher: voucherId, ma_chi_nhanh: bId }));
  }

  async getVoucherCategories() {
    try {
      const { data, error } = await supabase
        .from("danh_muc")
        .select("ma_danh_muc, ten_danh_muc");

      if (error || !data) {
        console.error("Lỗi lấy danh mục:", error);
        return [];
      }

      return data; // Trả về danh sách [{ ma_danh_muc, ten_danh_muc }, ...]
    } catch (e) {
      console.error("Exception:", e);
      return [];
    }
  }
}


module.exports = new VoucherBranchRepository();
