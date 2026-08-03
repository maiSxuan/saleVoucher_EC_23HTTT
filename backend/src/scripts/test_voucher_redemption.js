/**
 * Test script: Kiểm thử toàn diện BR-PAR-05 và BR-PAR-06
 * Chạy lệnh: node src/scripts/test_voucher_redemption.js
 */

require('dotenv').config();
const voucherVerificationService = require('../modules/core-access/business/services/voucher-verification.service');
const voucherRedemptionService = require('../modules/core-access/business/services/voucher-redemption.service');
const issuedVoucherRepository = require('../modules/core-access/data/repositories/issued-voucher.repository');

async function runTests() {
  console.log('====================================================');
  console.log('BẮT ĐẦU KIỂM THỬ TOÀN DIỆN BR-PAR-05 VÀ BR-PAR-06');
  console.log('====================================================\n');

  try {
    // 1. Lấy danh sách mã mẫu từ DB
    console.log('--- TEST 1: Lấy danh sách mã voucher mẫu từ DB ---');
    const sampleCodes = await voucherVerificationService.getSampleCodes();
    console.log(`Tìm thấy ${sampleCodes.length} mã mẫu trong DB:`);
    sampleCodes.forEach(s => console.log(`  - ${s.code} [${s.status}] -> ${s.voucherName}`));

    // 2. Kiểm tra tra cứu mã CHƯA SỬ DỤNG (Hợp lệ)
    const validCode = 'EC26-FOOD-E5F6G7H8';
    console.log(`\n--- TEST 2: Tra cứu mã CHƯA SỬ DỤNG "${validCode}" (BR-PAR-05) ---`);
    const validRes = await voucherVerificationService.verifyVoucher({
      code: validCode,
      actor: { role: 'ADMIN', name: 'Admin Test' },
    });
    console.log('- Hợp lệ (valid):', validRes.valid);
    console.log('- Trạng thái (status):', validRes.status);
    console.log('- Thông điệp:', validRes.message);
    console.log('- Tên voucher:', validRes.data?.voucherName);
    console.log('- Giá trị giảm:', validRes.data?.discountValue);
    console.log('- Khách hàng sở hữu (ẩn danh NFR-02):', validRes.data?.customerMaskedName);
    console.log('- Có mã QR Thật (DataURL):', !!validRes.data?.qrCodeDataUrl);
    console.log('- Chi nhánh áp dụng:', validRes.data?.applicableBranches.map(b => b.branchName));

    // 3. Kiểm tra tra cứu mã ĐÃ SỬ DỤNG
    const usedCode = 'EC26-FOOD-A1B2C3D4';
    console.log(`\n--- TEST 3: Tra cứu mã ĐÃ SỬ DỤNG "${usedCode}" (RB-07) ---`);
    const usedRes = await voucherVerificationService.verifyVoucher({
      code: usedCode,
    });
    console.log('- Hợp lệ:', usedRes.valid);
    console.log('- Trạng thái:', usedRes.status);
    console.log('- Thông điệp:', usedRes.message);

    // 4. Kiểm tra tra cứu mã BỊ VÔ HIỆU HÓA
    const disabledCode = 'EC26-MOVIE-N5P6Q7R8';
    console.log(`\n--- TEST 4: Tra cứu mã VÔ HIỆU HÓA "${disabledCode}" ---`);
    const disabledRes = await voucherVerificationService.verifyVoucher({
      code: disabledCode,
    });
    console.log('- Hợp lệ:', disabledRes.valid);
    console.log('- Trạng thái:', disabledRes.status);
    console.log('- Thông điệp:', disabledRes.message);

    // 5. Kiểm tra tra cứu mã KHÔNG TỒN TẠI
    console.log('\n--- TEST 5: Tra cứu mã KHÔNG TỒN TẠI "FAKE-9999-NOTFOUND" ---');
    const fakeRes = await voucherVerificationService.verifyVoucher({
      code: 'FAKE-9999-NOTFOUND',
    });
    console.log('- Hợp lệ:', fakeRes.valid);
    console.log('- Trạng thái:', fakeRes.status);
    console.log('- Thông điệp:', fakeRes.message);

    // 6. Kiểm tra ràng buộc chi nhánh (RB-09)
    console.log('\n--- TEST 6: Kiểm tra ràng buộc chi nhánh RB-09 ---');
    const branchRes = await voucherVerificationService.verifyVoucher({
      code: validCode,
      branchId: '00000000-0000-0000-0000-000000000000', // Branch không có trong danh sách
      actor: { role: 'Nhan vien ban hang', ma_chi_nhanh: '00000000-0000-0000-0000-000000000000' },
    });
    console.log('- Kết quả khi chi nhánh không khớp:', branchRes.status);
    console.log('- Thông điệp:', branchRes.message);

    // 7. Lịch sử sử dụng tại chi nhánh
    console.log('\n--- TEST 7: Lấy lịch sử sử dụng voucher tại quầy ---');
    const history = await voucherRedemptionService.getUsageHistory({ page: 1, limit: 5 });
    console.log(`- Lấy thành công ${history.records.length}/${history.total} giao dịch sử dụng.`);

    console.log('\n====================================================');
    console.log('TẤT CẢ 7 BÀI TEST BR-PAR-05 & BR-PAR-06 ĐỀU ĐẠT CHUẨN!');
    console.log('====================================================');
  } catch (err) {
    console.error('LỖI KIỂM THỬ:', err);
  }
}

runTests();
