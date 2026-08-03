const supabase = require('../config/supabase');

async function inspectFK() {
  const { data: vmList } = await supabase.from('voucher_mua').select('ma_nhan_vien_xac_nhan').not('ma_nhan_vien_xac_nhan', 'is', null).limit(3);
  console.log('Sample ma_nhan_vien_xac_nhan in voucher_mua:', vmList);

  const sampleStaff = vmList?.[0]?.ma_nhan_vien_xac_nhan;
  if (sampleStaff) {
    const { data: tk } = await supabase.from('taikhoan').select('*').eq('ma_tk', sampleStaff);
    console.log('Found in taikhoan:', tk);
    const { data: nd } = await supabase.from('nguoidung').select('*').eq('ma_nguoi_dung', sampleStaff);
    console.log('Found in nguoidung:', nd);
  }
}

inspectFK();
