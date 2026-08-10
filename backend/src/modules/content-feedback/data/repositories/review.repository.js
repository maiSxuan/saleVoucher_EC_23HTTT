const supabase = require("../../../../config/supabase");

// Lấy tất cả đánh giá
async function findAll() {
  const { data, error } = await supabase.from('danhgia').select('*');
  if (error) throw error;
  return data;
}

// Lấy đánh giá theo id
async function findById(id) {
  const { data, error } = await supabase.from('danhgia').select('*').eq('ma_danh_gia', id).single();
  if (error) throw error;
  return data;
}

// Tạo mới một đánh giá
async function create(payload) {
  const { data, error } = await supabase.from('danhgia').insert([payload]).select();
  if (error) throw error;
  return data[0];
}

// Lấy đánh giá theo voucher id
async function findByVoucherId(voucherId) {
  const { data: voucherMuas, error: vmError } = await supabase
    .from('voucher_mua')
    .select('ma_voucher_mua')
    .eq('ma_voucher', voucherId);
  
  if (vmError) throw vmError;
  if (!voucherMuas || voucherMuas.length === 0) return [];

  const muaIds = voucherMuas.map(v => v.ma_voucher_mua);

  const { data, error } = await supabase
    .from('danhgia')
    .select('*')
    .in('ma_voucher_mua', muaIds);

  if (error) throw error;
  return data || [];
}

// Lấy đánh giá theo ma_voucher_mua (lần mua cụ thể)
async function findByVoucherPurchaseId(voucherPurchaseId) {
  const { data, error } = await supabase
    .from('danhgia')
    .select('*')
    .eq('ma_voucher_mua', voucherPurchaseId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

module.exports = {
  findAll,
  findById,
  create,
  findByVoucherId,
  findByVoucherPurchaseId,
};
