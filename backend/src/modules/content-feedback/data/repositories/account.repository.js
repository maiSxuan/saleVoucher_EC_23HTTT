const supabase = require("../../../../config/supabase");

async function findTkIdByNguoiDungId(maNguoiDung) {
  const { data, error } = await supabase
    .from('taikhoan')
    .select('ma_tk')
    .eq('ma_nguoi_dung', maNguoiDung)
    .single();
  if (error) return null;
  return data.ma_tk;
}

module.exports = { findTkIdByNguoiDungId };
