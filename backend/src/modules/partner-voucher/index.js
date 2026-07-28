/**
 * Purpose: Entry point của module partner-voucher.
 * File này gom các service quan trọng để các module khác import dễ dàng.
 */
const partnerService = require("./business/services/partner.service");
const branchService = require("./business/services/branch.service");
const partnerApprovalService = require("./business/services/partner-approval.service");
const voucherService = require("./business/services/voucher.service");
const voucherApprovalService = require("./business/services/voucher-approval.service");
const partnerReportService = require("./business/services/partner-report.service");

module.exports = {
  partnerService,
  branchService,
  partnerApprovalService,
  voucherService,
  voucherApprovalService,
  partnerReportService,
};
