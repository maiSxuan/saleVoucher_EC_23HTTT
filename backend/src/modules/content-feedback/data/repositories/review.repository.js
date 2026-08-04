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

module.exports = {
  findAll,
  findById,
  create,
};
