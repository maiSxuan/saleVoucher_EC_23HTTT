const supabase = require("../../../../config/supabase");

// Lấy tất cả khiếu nại
async function findAll() {
  const { data, error } = await supabase.from('khieunai').select('*');
  if (error) throw error;
  return data;
}

// Lấy khiếu nại theo id
async function findById(id) {
  const { data, error } = await supabase.from('khieunai').select('*').eq('ma_khieu_nai', id).single();
  if (error) throw error;
  return data;
}

// Tạo mới một khiếu nại
async function create(payload) {
  const { data, error } = await supabase.from('khieunai').insert([payload]).select();
  if (error) throw error;
  return data[0];
}

// Lấy khiếu nại theo ma_voucher_mua (lần mua cụ thể)
async function findByVoucherPurchaseId(voucherPurchaseId) {
  const { data, error } = await supabase
    .from('khieunai')
    .select('*')
    .eq('ma_voucher_mua', voucherPurchaseId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Cập nhật trạng thái và tài khoản xử lý khiếu nại
async function updateStatusAndHandler(id, status, handlerId) {
  const { data, error } = await supabase
    .from('khieunai')
    .update({ trang_thai: status, ma_tk_xuly: handlerId })
    .eq('ma_khieu_nai', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

module.exports = {
  findAll,
  findById,
  create,
  findByVoucherPurchaseId,
  updateStatusAndHandler,
};
