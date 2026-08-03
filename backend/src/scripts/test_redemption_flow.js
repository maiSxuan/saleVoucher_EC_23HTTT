require('dotenv').config();
const voucherRedemptionService = require('../modules/core-access/business/services/voucher-redemption.service');
const issuedVoucherRepository = require('../modules/core-access/data/repositories/issued-voucher.repository');
const supabase = require('../config/supabase');

async function testRedeemFlow() {
  console.log('--- TEST REDEMPTION WITH AUTHENTICATED STAFF ---');

  // Lấy một nhân viên bán hàng thật từ DB
  const { data: staffList } = await supabase
    .from('taikhoan')
    .select('ma_tk, ma_nguoi_dung, nguoidung:ma_nguoi_dung(ho_ten, vai_tro, ma_chi_nhanh)')
    .eq('nguoidung.vai_tro', 'Nhan vien ban hang')
    .limit(1);

  console.log('Staff account from DB:', staffList?.[0]);

  const testStaff = staffList?.[0] || {
    ma_tk: '10000000-0000-0000-0000-000000000013',
    ma_nguoi_dung: '00000000-0000-0000-0000-000000000013',
    nguoidung: { vai_tro: 'Nhan vien ban hang', ma_chi_nhanh: '30000000-0000-0000-0000-000000000001' }
  };

  const actor = {
    id: testStaff.ma_nguoi_dung,
    accountId: testStaff.ma_tk,
    role: 'PARTNER_STAFF',
    vai_tro_he_thong: testStaff.nguoidung?.vai_tro || 'Nhan vien ban hang',
    ma_chi_nhanh: testStaff.nguoidung?.ma_chi_nhanh || '30000000-0000-0000-0000-000000000001',
  };

  const testCode = 'EC26-FOOD-E5F6G7H8';

  try {
    // 1. Thử xác nhận sử dụng
    console.log(`Tiến hành redeem voucher: ${testCode}`);
    const result = await voucherRedemptionService.redeemVoucher({
      code: testCode,
      branchId: actor.ma_chi_nhanh,
      actor,
      note: 'Kiểm thử redemption với tài khoản nhân viên thật',
    });

    console.log('Redeem Result:', result.success ? 'THÀNH CÔNG' : 'THẤT BẠI', result.message);

    // 2. Thử redeem lại lần 2 (phải bị từ chối)
    console.log('Thử redeem lại lần 2 (kỳ vọng bị từ chối do đã dùng):');
    try {
      await voucherRedemptionService.redeemVoucher({
        code: testCode,
        branchId: actor.ma_chi_nhanh,
        actor,
      });
      console.error('LỖI: Lẽ ra phải bị từ chối ở lần 2!');
    } catch (err2) {
      console.log('ĐÚNG ĐẶC TẢ: Lần 2 bị từ chối chính xác ->', err2.message);
    }

    // 3. Hoàn tác trạng thái về Chua su dung để tiện test các lần sau
    console.log('Hoàn tác trạng thái về Chua su dung cho mã test...');
    await issuedVoucherRepository.revertRedemption(testCode);
    console.log('Hoàn tác hoàn tất!');

  } catch (err) {
    console.error('LỖI TRONG QUÁ TRÌNH REDEEM:', err);
  }
}

testRedeemFlow();
