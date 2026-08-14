const voucherService = require("./src/modules/partner-voucher/business/services/voucher.service");

async function testCategoriesApi() {
  const cates = await voucherService.getCategories();
  console.log("Categories returned from VoucherService.getCategories():", cates);
}

testCategoriesApi();
