const supabase = require('../config/supabase');

async function inspect() {
  const tables = [
    'voucher_mua', 'voucher', 'VOUCHER_MUA', 'VOUCHER', 'chi_tiet_don_hang',
    'donhang', 'chinhanh', 'hosodn', 'nguoidung', 'taikhoan', 'log_ht',
    'voucher_chinhanh', 'chi_nhanh_voucher'
  ];
  for (const t of tables) {
    try {
      const { data, error } = await supabase.from(t).select('*').limit(2);
      if (error) {
        console.log(`Table ${t}: ERROR -> ${error.message}`);
      } else {
        console.log(`Table "${t}": OK (${data.length} rows), Columns:`, Object.keys(data[0] || {}));
        if (data.length > 0) {
          console.log(`Sample row in "${t}":`, JSON.stringify(data[0], null, 2));
        }
      }
    } catch (e) {
      console.log(`Table ${t}: EXCEPTION -> ${e.message}`);
    }
  }
}

inspect();
