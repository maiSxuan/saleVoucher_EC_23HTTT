const voucherRepository = require("./src/modules/partner-voucher/data/repositories/voucher.repository");

async function testCategorySave() {
  console.log("Resolving 'Du lịch':", await voucherRepository.resolveCategoryUuid("Du lịch"));
  console.log("Resolving 'Sức khỏe và Làm đẹp':", await voucherRepository.resolveCategoryUuid("Sức khỏe và Làm đẹp"));
  console.log("Resolving UUID directly '40000000-0000-0000-0000-000000000004':", await voucherRepository.resolveCategoryUuid("40000000-0000-0000-0000-000000000004"));
}

testCategorySave();
