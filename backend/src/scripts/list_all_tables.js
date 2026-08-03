const supabase = require('../config/supabase');

async function listAllTables() {
  const { data, error } = await supabase.rpc('get_tables');
  if (error) {
    console.log('RPC get_tables failed, testing candidates...');
    const candidates = [
      'danhmuc', 'thanhtoan', 'voucher_apdung', 'apdung_chinhanh', 'chinhanh_apdung',
      'voucher_chinhanh', 'danhgia', 'phanhoi', 'otp', 'thongbao', 'giohang', 'voucher_yeuthich'
    ];
    for (const c of candidates) {
      const { data: d, error: err } = await supabase.from(c).select('*').limit(1);
      if (!err) console.log(`Table exists: ${c}, cols:`, Object.keys(d[0] || {}));
    }
  } else {
    console.log('Tables:', data);
  }
}

listAllTables();
