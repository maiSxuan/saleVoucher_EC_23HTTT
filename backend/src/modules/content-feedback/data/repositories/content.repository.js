const supabase = require("../../../../config/supabase");

// Lấy nội dung theo loại
async function findByType(type) {
  const { data, error } = await supabase.from('noidung').select('*').eq('loai', type);
  if (error) throw error;
  return data;
}

// Lấy tất cả nội dung
async function findAll() {
  const { data, error } = await supabase.from('noidung').select('*');
  if (error) throw error;
  return data;
}

// Lấy nội dung theo id
async function findById(id) {
  const { data, error } = await supabase.from('noidung').select('*').eq('ma_nd', id).single();
  if (error) throw error;
  return data;
}

// Tạo mới một nội dung
async function create(payload) {
  const { data, error } = await supabase.from('noidung').insert([payload]).select();
  if (error) throw error;
  return data[0];
}

// Cập nhật nội dung
async function update(id, payload) {
  const { data, error } = await supabase.from('noidung').update(payload).eq('ma_nd', id).select();
  if (error) throw error;
  return data[0];
}

// Xóa nội dung
async function remove(id) {
  const { error } = await supabase.from('noidung').delete().eq('ma_nd', id);
  if (error) throw error;
  return true;
}

module.exports = {
  findAll,
  findByType,
  findById,
  create,
  update,
  remove,
};
