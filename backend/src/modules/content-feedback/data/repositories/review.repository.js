const supabase = require("../../../../config/supabase");

// Lấy tất cả đánh giá với hỗ trợ bộ lọc, phân trang và mapping dữ liệu qua các bảng liên quan
async function findAll(filters = {}) {
  const page = parseInt(filters.page, 10) || 1;
  const limit = parseInt(filters.limit, 10) || 10;
  const offset = (page - 1) * limit;

  let query = supabase.from('danhgia').select('*', { count: 'exact' });

  if (filters.search) {
    query = query.ilike('noi_dung', `%${filters.search}%`);
  }
  if (filters.rating && filters.rating !== 'all') {
    query = query.eq('diem', parseInt(filters.rating, 10));
  }
  if (filters.userId) {
    query = query.eq('ma_tk_danhgia', filters.userId);
  }
  if (filters.voucherPurchaseId) {
    query = query.eq('ma_voucher_mua', filters.voucherPurchaseId);
  }
  if (filters.voucherId) {
    const { data: vmData } = await supabase
      .from('voucher_mua')
      .select('ma_voucher_mua')
      .eq('ma_voucher', filters.voucherId);
    const mIds = (vmData || []).map(v => v.ma_voucher_mua);
    if (mIds.length > 0) {
      query = query.in('ma_voucher_mua', mIds);
    } else {
      return { data: [], count: 0 };
    }
  }
  if (filters.fromDate) {
    query = query.gte('ngay_danh_gia', filters.fromDate);
  }
  if (filters.toDate) {
    query = query.lte('ngay_danh_gia', filters.toDate);
  }

  query = query.order('ngay_danh_gia', { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  const reviews = data || [];

  if (reviews.length === 0) return { data: [], count: count || 0 };

  // Batch fetch reviewer names and voucher details
  const tkIds = [...new Set(reviews.map(r => r.ma_tk_danhgia).filter(Boolean))];
  const accountsMap = {};
  if (tkIds.length > 0) {
    const { data: tkData } = await supabase
      .from('taikhoan')
      .select('ma_tk, ma_nguoi_dung, thong_tin_dang_nhap')
      .in('ma_tk', tkIds);
    
    const nguoiDungIds = [...new Set((tkData || []).map(t => t.ma_nguoi_dung).filter(Boolean))];
    const ndMap = {};
    if (nguoiDungIds.length > 0) {
      const { data: ndData } = await supabase
        .from('nguoidung')
        .select('ma_nguoi_dung, ho_ten')
        .in('ma_nguoi_dung', nguoiDungIds);
      (ndData || []).forEach(nd => { ndMap[nd.ma_nguoi_dung] = nd.ho_ten; });
    }
    (tkData || []).forEach(t => {
      accountsMap[t.ma_tk] = ndMap[t.ma_nguoi_dung] || t.thong_tin_dang_nhap || 'Khách hàng';
    });
  }

  const vmIds = [...new Set(reviews.map(r => r.ma_voucher_mua).filter(Boolean))];
  const voucherMuaMap = {};
  if (vmIds.length > 0) {
    const { data: vmData } = await supabase
      .from('voucher_mua')
      .select('ma_voucher_mua, voucher_code, ma_voucher')
      .in('ma_voucher_mua', vmIds);
    
    const vIds = [...new Set((vmData || []).map(vm => vm.ma_voucher).filter(Boolean))];
    const vMap = {};
    if (vIds.length > 0) {
      const { data: vData } = await supabase
        .from('voucher')
        .select('ma_voucher, ten_voucher')
        .in('ma_voucher', vIds);
      (vData || []).forEach(v => { vMap[v.ma_voucher] = v.ten_voucher; });
    }

    (vmData || []).forEach(vm => {
      voucherMuaMap[vm.ma_voucher_mua] = {
        voucherCode: vm.voucher_code,
        voucherName: vMap[vm.ma_voucher] || 'Voucher'
      };
    });
  }

  const mappedData = reviews.map(r => ({
    ...r,
    reviewer_name: accountsMap[r.ma_tk_danhgia] || 'Khách hàng',
    voucher_name: voucherMuaMap[r.ma_voucher_mua]?.voucherName || 'Voucher',
    voucher_code: voucherMuaMap[r.ma_voucher_mua]?.voucherCode || '',
  }));

  return { data: mappedData, count: count || 0 };
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

// Xóa đánh giá
async function remove(id) {
  const { error } = await supabase.from('danhgia').delete().eq('ma_danh_gia', id);
  if (error) throw error;
  return true;
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
  remove,
  findByVoucherId,
  findByVoucherPurchaseId,
};
