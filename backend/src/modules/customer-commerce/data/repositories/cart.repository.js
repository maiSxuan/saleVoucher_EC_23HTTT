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
}

module.exports = new CartRepository();
