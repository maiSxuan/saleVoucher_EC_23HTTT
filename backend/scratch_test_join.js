const supabase = require("./src/config/supabase");

async function testJoin() {
  const { data, error } = await supabase
    .from("voucher")
    .select("ma_voucher, ten_voucher, ma_danh_muc, danh_muc(ten_danh_muc)");

  if (error) {
    console.error("Join error:", error);
  } else {
    console.log("Joined vouchers count:", data.length);
    console.log("Sample joined voucher:", data[0]);
    const nullCates = data.filter(v => !v.danh_muc?.ten_danh_muc);
    console.log("Vouchers with NULL joined category:", nullCates.length);
  }
}

testJoin();
