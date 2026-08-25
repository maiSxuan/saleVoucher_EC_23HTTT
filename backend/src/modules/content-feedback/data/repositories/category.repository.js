/**
 * Purpose: Repository thao tác với bảng danh_muc trong cơ sở dữ liệu.
 */
const supabase = require("../../../../config/supabase");

async function findAll() {
  const { data, error } = await supabase
    .from("danh_muc")
    .select("ma_danh_muc, ten_danh_muc, mo_ta, hinh_anh_url")
    .order("ten_danh_muc", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function findById(ma_danh_muc) {
  const { data, error } = await supabase
    .from("danh_muc")
    .select("ma_danh_muc, ten_danh_muc, mo_ta, hinh_anh_url")
    .eq("ma_danh_muc", ma_danh_muc)
    .single();
  if (error) throw error;
  return data;
}

async function create(payload) {
  const { data, error } = await supabase
    .from("danh_muc")
    .insert([payload])
    .select("ma_danh_muc, ten_danh_muc, mo_ta, hinh_anh_url");
  if (error) throw error;
  return data[0];
}

async function update(ma_danh_muc, payload) {
  const { data, error } = await supabase
    .from("danh_muc")
    .update(payload)
    .eq("ma_danh_muc", ma_danh_muc)
    .select("ma_danh_muc, ten_danh_muc, mo_ta, hinh_anh_url");
  if (error) throw error;
  return data[0];
}

async function remove(ma_danh_muc) {
  const { error } = await supabase
    .from("danh_muc")
    .delete()
    .eq("ma_danh_muc", ma_danh_muc);
  if (error) throw error;
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
