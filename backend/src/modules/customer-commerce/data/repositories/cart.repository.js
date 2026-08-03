/**
 * Purpose: Repository cho giỏ hàng của customer.
 */
const supabase = require("../../../../config/supabase");

class CartRepository {
  async findOrCreateCart(accountId) {
    const { data: existing, error: findErr } = await supabase
      .from("giohang")
      .select("ma_gio_hang")
      .eq("ma_tksohuu", accountId)
      .maybeSingle();

    if (findErr) {
      console.error("[CartRepository] findOrCreateCart lỗi:", findErr); // 👈 thêm dòng này
      const err = new Error("Không thể truy xuất giỏ hàng");
      err.status = 500;
      throw err;
    }
    if (existing) return existing.ma_gio_hang;

    const { data: created, error: createErr } = await supabase
      .from("giohang")
      .insert({ ma_tksohuu: accountId })
      .select("ma_gio_hang")
      .single();

    if (createErr) {
      const err = new Error("Không thể tạo giỏ hàng");
      err.status = 500;
      throw err;
    }
    return created.ma_gio_hang;
  }

  async findItem(cartId, voucherId) {
    const { data, error } = await supabase
      .from("chitietgiohang")
      .select("so_luong")
      .eq("ma_gio_hang", cartId)
      .eq("ma_voucher", voucherId)
      .maybeSingle();

    if (error) {
      const err = new Error("Không thể truy xuất giỏ hàng");
      err.status = 500;
      throw err;
    }
    return data;
  }

  async upsertItem(cartId, voucherId, quantity) {
    const { error } = await supabase.from("chitietgiohang").upsert(
      {
        ma_gio_hang: cartId,
        ma_voucher: voucherId,
        so_luong: quantity,
        ngay_cap_nhat: new Date().toISOString(),
      },
      { onConflict: "ma_gio_hang,ma_voucher" },
    );

    if (error) {
      const err = new Error("Không thể thêm voucher vào giỏ hàng");
      err.status = 500;
      throw err;
    }
  }

  async getItems(cartId) {
    const { data, error } = await supabase
      .from("chitietgiohang")
      .select(
        `
        ma_voucher,
        so_luong,
        voucher (
          ma_voucher, ten_voucher, gia_goc, gia_tri_giam,
          so_luong_phat_hanh, so_luong_da_ban, trang_thai,
          tg_bat_dau_ban, tg_ket_thuc_ban, hinh_anh_url,
          voucher_cn ( chinhanh ( ten_chi_nhanh, hosodn ( ten_dn ) ) )
        )
        `,
      )
      .eq("ma_gio_hang", cartId);

    if (error) {
      const err = new Error("Không thể truy xuất giỏ hàng"); // E1
      err.status = 500;
      throw err;
    }
    return data || [];
  }

  async removeItems(cartId, voucherIds) {
    const { error } = await supabase
      .from("chitietgiohang")
      .delete()
      .eq("ma_gio_hang", cartId)
      .in("ma_voucher", voucherIds);

    if (error) {
      const err = new Error("Không thể xóa voucher khỏi giỏ hàng");
      err.status = 500;
      throw err;
    }
  }
}

module.exports = new CartRepository();
