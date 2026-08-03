const supabase = require('../config/supabase');

async function inspectVoucher() {
  const { data: vList } = await supabase.from('voucher').select('*');
  console.log('All Vouchers in DB:', JSON.stringify(vList, null, 2));

  const { data: vmList } = await supabase.from('voucher_mua').select('*');
  console.log('All voucher_mua in DB:', JSON.stringify(vmList, null, 2));
}

inspectVoucher();
