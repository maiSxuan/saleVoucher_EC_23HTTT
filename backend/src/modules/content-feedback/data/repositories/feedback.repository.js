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

module.exports = {
  findAll,
  findById,
  create,
};
