const supabase = require('../config/supabase');

async function inspectStaffBranch() {
  const { data: staffList } = await supabase
    .from('nguoidung')
    .select('ma_nguoi_dung, ho_ten, vai_tro, ma_chi_nhanh')
    .eq('vai_tro', 'Nhan vien ban hang');
  console.log('Staff list:', staffList);

  const { data: branches } = await supabase
    .from('chinhanh')
    .select('*');
  console.log('All branches in DB:', branches);
}

inspectStaffBranch();
