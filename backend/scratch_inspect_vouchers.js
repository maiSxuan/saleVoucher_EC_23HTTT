const supabase = require("./src/config/supabase");

async function checkVouchers() {
  const { data, error } = await supabase
    .from("voucher")
    .select("ma_voucher, ten_voucher, ma_danh_muc, danh_muc(ten_danh_muc)");

  console.log("Vouchers in DB:", JSON.stringify(data, null, 2));
}

checkVouchers();
