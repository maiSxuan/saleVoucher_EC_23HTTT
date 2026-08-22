const supabase = require('../../../../config/supabase');
const OrderStatus = require('../../../../common/constants/order-status');
const PaymentStatus = require('../../../../common/constants/payment-status');
const VoucherCodeStatus = require('../../../../common/constants/issued-voucher-status');
const { withSupabaseTransaction } = require('../../../../common/database/transaction');

function removeDiacritics(str) {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getAggregateVoucherCodeStatus(codes = []) {
  if (codes.length === 0) return 'not_issued';

  const priority = [
    VoucherCodeStatus.LOI_SINH_MA,
    VoucherCodeStatus.CHUA_SU_DUNG,
    VoucherCodeStatus.DA_SU_DUNG,
    VoucherCodeStatus.HET_HAN,
    VoucherCodeStatus.VO_HIEU_HOA,
  ];

  return priority.find((status) => codes.some((code) => code.trang_thai === status))
    || codes[0].trang_thai
    || 'not_issued';
}

function uniqueValues(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function firstRelation(value) {
  return Array.isArray(value) ? value[0] : value;
}

function relationRows(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function sortByDateDesc(rows = [], key) {
  return [...rows].sort((left, right) => {
    const leftTime = left?.[key] ? new Date(left[key]).getTime() : 0;
    const rightTime = right?.[key] ? new Date(right[key]).getTime() : 0;
    return rightTime - leftTime;
  });
}

const REJECTED_REFUND_DISPLAY_STATUS = 'Huy yeu cau hoan tien';

function getCustomerOrderDisplayStatus(orderStatus, cancelRequests = []) {
  const latestCancelRequest = cancelRequests[0] || null;
  if (
    orderStatus === OrderStatus.DA_THANH_TOAN
    && latestCancelRequest?.trang_thai === 'Da tu choi'
  ) {
    return REJECTED_REFUND_DISPLAY_STATUS;
  }
  return orderStatus;
}

function ensureBatchQuery(result, label) {
  if (result?.error) {
    throw new Error(`${label}: ${result.error.message}`);
  }
  return result?.data || [];
}

async function enrichOrderItems(items) {
  if (!items?.length) return [];

  const voucherIds = uniqueValues(items.map((item) => item.ma_voucher || item.voucherId));
  const [voucherResult, partnerResult] = await Promise.all([
    supabase
      .from('voucher')
      .select('ma_voucher, ten_voucher, mo_ta, hinh_anh_url, dieu_kien_ap_dung')
      .in('ma_voucher', voucherIds),
    supabase
      .from('voucher_cn')
      .select('ma_voucher, chinhanh:ma_chi_nhanh(hosodn:ma_hs(ten_dn))')
      .in('ma_voucher', voucherIds),
  ]);

  const voucherRows = ensureBatchQuery(voucherResult, 'Lỗi lấy thông tin voucher');
  const partnerRows = ensureBatchQuery(partnerResult, 'Lỗi lấy thông tin đối tác');
  const voucherById = new Map(voucherRows.map((voucher) => [voucher.ma_voucher, voucher]));
  const partnerNameByVoucherId = new Map();

  for (const link of partnerRows) {
    if (partnerNameByVoucherId.has(link.ma_voucher)) continue;
    const branch = firstRelation(link.chinhanh);
    const partner = firstRelation(branch?.hosodn);
    if (partner?.ten_dn) partnerNameByVoucherId.set(link.ma_voucher, partner.ten_dn);
  }

  return items.map((item) => {
    const voucherId = item.ma_voucher || item.voucherId;
    const voucher = voucherById.get(voucherId) || {};
    return {
      voucherId,
      voucherName: voucher.ten_voucher || 'Voucher',
      description: voucher.mo_ta || '',
      image: voucher.hinh_anh_url || '',
      terms: voucher.dieu_kien_ap_dung || '',
      partnerName: partnerNameByVoucherId.get(voucherId) || 'Đối tác',
      quantity: item.so_luong || 1,
      unitPrice: item.gia_tai_thoi_diem_mua || 0,
    };
  });
}

async function fetchOrderExtraDetails(dh) {
  let customerName = 'Khách vãng lai';
  let customerEmail = '';
  let customerPhone = '';

  if (dh.ma_tk_dat) {
    const { data: tk } = await supabase
      .from('taikhoan')
      .select('ma_tk, ma_nguoi_dung')
      .eq('ma_tk', dh.ma_tk_dat)
      .maybeSingle();

    if (tk?.ma_nguoi_dung) {
      const { data: nd } = await supabase
        .from('nguoidung')
        .select('ho_ten, email, sdt')
        .eq('ma_nguoi_dung', tk.ma_nguoi_dung)
        .maybeSingle();

      if (nd) {
        customerName = nd.ho_ten || customerName;
        customerEmail = nd.email || '';
        customerPhone = nd.sdt || '';
      }
    }
  } else if (dh.nguoi_nhan) {
    customerName = dh.nguoi_nhan;
  }

  const { data: payments, error: paymentsError } = await supabase
    .from('thanhtoan')
    .select('*')
    .eq('ma_dh', dh.ma_dh)
    .order('thoi_gian_tt', { ascending: false });
  if (paymentsError) throw new Error(`Lỗi lấy lịch sử thanh toán: ${paymentsError.message}`);

  const paymentIds = (payments || []).map(p => p.ma_thanh_toan);
  let refunds = [];
  if (paymentIds.length > 0) {
    const { data: refData, error: refundError } = await supabase
      .from('hoantien')
      .select('*')
      .in('ma_thanh_toan', paymentIds)
      .order('ngay_xu_ly', { ascending: false });
    if (refundError) throw new Error(`Lỗi lấy lịch sử hoàn tiền: ${refundError.message}`);
    refunds = refData || [];
  }

  // Lấy yêu cầu hủy liên kết với đơn hàng
  const { data: cancelRequests, error: cancelRequestError } = await supabase
    .from('yeucauhuy')
    .select('*')
    .eq('ma_dh', dh.ma_dh)
    .order('ngay_yeu_cau', { ascending: false });
  if (cancelRequestError) throw new Error(`Lỗi lấy yêu cầu hủy: ${cancelRequestError.message}`);

  return {
    customerName,
    customerEmail,
    customerPhone,
    payments: payments || [],
    refunds: refunds || [],
    cancelRequests: cancelRequests || [],
  };
}

class OrderRepository {

  async create({ accountId, total }) {
    const { data, error } = await supabase
      .from("donhang")
      .insert({ ma_tk_dat: accountId, tong_tien: total })
      .select("ma_dh, ngay_dat, tong_tien, trang_thai")
      .single();
    if (error) {
      const err = new Error("Không thể tạo đơn hàng"); // E2
      err.status = 500;
      throw err;
    }
    return data;
  }

  async updateStatus(orderId, status) {
    const { error } = await supabase
      .from("donhang")
      .update({ trang_thai: status })
      .eq("ma_dh", orderId);
    if (error) {
      const err = new Error("Không thể cập nhật trạng thái đơn hàng");
      err.status = 500;
      throw err;
    }
  }

  async findById(orderId, accountId) {
    const { data, error } = await supabase
      .from("donhang")
      .select("ma_dh, ngay_dat, tong_tien, trang_thai, ma_tk_dat")
      .eq("ma_dh", orderId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất đơn hàng");
      err.status = 500;
      throw err;
    }
    if (!data || data.ma_tk_dat !== accountId) return null; // không cho xem/thao tác đơn của người khác
    return data;
  }

  async findRawById(orderId) {
    const { data, error } = await supabase
      .from("donhang")
      .select("ma_dh, tong_tien, trang_thai, ma_tk_dat")
      .eq("ma_dh", orderId)
      .maybeSingle();
    if (error) {
      const err = new Error("Không thể truy xuất đơn hàng");
      err.status = 500;
      throw err;
    }
    return data;
  }

  // -----------------------------------------------------------------------
  // 1. KHÁCH HÀNG: LẤY DANH SÁCH ĐƠN HÀNG
  // -----------------------------------------------------------------------
  async findCustomerOrders(accountId, { status, page = 1, limit = 10, summary = false } = {}) {
    const offset = (page - 1) * limit;
    const filtersRejectedRefund = status === REJECTED_REFUND_DISPLAY_STATUS;
    const filtersPaidOrders = status === OrderStatus.DA_THANH_TOAN;
    let rejectedRefundOrderIds = [];

    if (filtersRejectedRefund || filtersPaidOrders) {
      const { data: rejectedRequests, error: rejectedRequestError } = await supabase
        .from('yeucauhuy')
        .select('ma_dh, donhang!inner(ma_tk_dat)')
        .eq('trang_thai', 'Da tu choi')
        .eq('donhang.ma_tk_dat', accountId);
      if (rejectedRequestError) {
        throw new Error(`Lỗi lọc đơn bị từ chối hoàn tiền: ${rejectedRequestError.message}`);
      }
      rejectedRefundOrderIds = uniqueValues(
        (rejectedRequests || []).map((request) => request.ma_dh),
      );

      if (filtersRejectedRefund && rejectedRefundOrderIds.length === 0) {
        return { orders: [], total: 0 };
      }
    }

    let query = supabase
      .from('donhang')
      .select(summary ? 'ma_dh, ngay_dat, tong_tien, trang_thai' : '*', { count: 'exact' })
      .eq('ma_tk_dat', accountId)
      .order('ngay_dat', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filtersRejectedRefund) {
      query = query
        .eq('trang_thai', OrderStatus.DA_THANH_TOAN)
        .in('ma_dh', rejectedRefundOrderIds);
    } else if (filtersPaidOrders) {
      query = query.eq('trang_thai', status);
      if (rejectedRefundOrderIds.length > 0) {
        query = query.not('ma_dh', 'in', `(${rejectedRefundOrderIds.join(',')})`);
      }
    } else if (status && status !== 'all') {
      query = query.eq('trang_thai', status);
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`Lỗi lấy danh sách đơn hàng khách hàng: ${error.message}`);
    }

    const orderRows = data || [];
    if (orderRows.length === 0) return { orders: [], total: count || 0 };

    const orderIds = orderRows.map((order) => order.ma_dh);

    // The history screen only needs card counters and the derived display status.
    // Avoid loading voucher metadata, payment/refund payloads and partner joins until
    // the customer opens an order detail.
    if (summary) {
      const [itemResult, codeResult, cancelRequestResult] = await Promise.all([
        supabase
          .from('chitietdonhang')
          .select('ma_dh')
          .in('ma_dh', orderIds),
        supabase
          .from('voucher_mua')
          .select('ma_dh')
          .in('ma_dh', orderIds),
        supabase
          .from('yeucauhuy')
          .select('ma_dh, trang_thai, ngay_yeu_cau')
          .in('ma_dh', orderIds)
          .order('ngay_yeu_cau', { ascending: false }),
      ]);

      const countByOrderId = (rows) => rows.reduce((counts, row) => {
        counts.set(row.ma_dh, (counts.get(row.ma_dh) || 0) + 1);
        return counts;
      }, new Map());
      const groupByOrderId = (rows) => rows.reduce((groups, row) => {
        if (!groups.has(row.ma_dh)) groups.set(row.ma_dh, []);
        groups.get(row.ma_dh).push(row);
        return groups;
      }, new Map());

      const itemCounts = countByOrderId(
        ensureBatchQuery(itemResult, 'Lỗi lấy số lượng chi tiết đơn hàng'),
      );
      const codeCounts = countByOrderId(
        ensureBatchQuery(codeResult, 'Lỗi lấy số lượng mã voucher'),
      );
      const cancelRequestsByOrderId = groupByOrderId(
        ensureBatchQuery(cancelRequestResult, 'Lỗi lấy trạng thái yêu cầu hủy'),
      );

      return {
        orders: orderRows.map((order) => {
          const orderCancelRequests = cancelRequestsByOrderId.get(order.ma_dh) || [];
          return {
            id: order.ma_dh,
            createdAt: order.ngay_dat,
            orderStatus: order.trang_thai,
            displayStatus: getCustomerOrderDisplayStatus(order.trang_thai, orderCancelRequests),
            total: order.tong_tien,
            itemCount: itemCounts.get(order.ma_dh) || 0,
            codeCount: codeCounts.get(order.ma_dh) || 0,
          };
        }),
        total: count || 0,
      };
    }

    const [itemResult, codeResult, paymentResult, cancelRequestResult] = await Promise.all([
      supabase
        .from('chitietdonhang')
        .select('*')
        .in('ma_dh', orderIds),
      supabase
        .from('voucher_mua')
        .select(`
          ma_dh,
          ma_voucher_mua,
          ma_voucher,
          voucher_code,
          trang_thai,
          thoi_gian_sinh_ma,
          ngay_su_dung,
          chinhanh:ma_chi_nhanh_su_dung ( ten_chi_nhanh )
        `)
        .in('ma_dh', orderIds),
      supabase
        .from('thanhtoan')
        .select('*')
        .in('ma_dh', orderIds)
        .order('thoi_gian_tt', { ascending: false }),
      supabase
        .from('yeucauhuy')
        .select('*')
        .in('ma_dh', orderIds)
        .order('ngay_yeu_cau', { ascending: false }),
    ]);

    const rawItems = ensureBatchQuery(itemResult, 'Lỗi lấy chi tiết đơn hàng');
    const codes = ensureBatchQuery(codeResult, 'Lỗi lấy mã voucher');
    const payments = ensureBatchQuery(paymentResult, 'Lỗi lấy lịch sử thanh toán');
    const cancelRequests = ensureBatchQuery(cancelRequestResult, 'Lỗi lấy yêu cầu hủy');
    const enrichedItems = await enrichOrderItems(rawItems);
    const paymentIds = payments.map((payment) => payment.ma_thanh_toan);
    let refunds = [];

    if (paymentIds.length > 0) {
      const refundResult = await supabase
        .from('hoantien')
        .select('*')
        .in('ma_thanh_toan', paymentIds)
        .order('ngay_xu_ly', { ascending: false });
      refunds = ensureBatchQuery(refundResult, 'Lỗi lấy lịch sử hoàn tiền');
    }

    const groupRows = (rows, getKey) => rows.reduce((groups, row, index) => {
      const key = getKey(row, index);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(row);
      return groups;
    }, new Map());
    const enrichedItemsByOrderId = groupRows(
      enrichedItems,
      (_item, index) => rawItems[index]?.ma_dh,
    );
    const codesByOrderId = groupRows(codes, (code) => code.ma_dh);
    const paymentsByOrderId = groupRows(payments, (payment) => payment.ma_dh);
    const cancelRequestsByOrderId = groupRows(cancelRequests, (request) => request.ma_dh);
    const refundsByPaymentId = groupRows(refunds, (refund) => refund.ma_thanh_toan);

    const orders = orderRows.map((dh) => {
      const orderPayments = paymentsByOrderId.get(dh.ma_dh) || [];
      const latestPayment = orderPayments[0] || null;
      const orderCancelRequests = cancelRequestsByOrderId.get(dh.ma_dh) || [];
      const orderRefunds = sortByDateDesc(
        orderPayments.flatMap(
          (payment) => refundsByPaymentId.get(payment.ma_thanh_toan) || [],
        ),
        'ngay_xu_ly',
      );
      const orderCodes = codesByOrderId.get(dh.ma_dh) || [];

      return {
        id: dh.ma_dh,
        createdAt: dh.ngay_dat,
        orderStatus: dh.trang_thai,
        displayStatus: getCustomerOrderDisplayStatus(dh.trang_thai, orderCancelRequests),
        paymentStatus: latestPayment ? latestPayment.trang_thai : PaymentStatus.DANG_XU_LY,
        total: dh.tong_tien,
        cancelReason: dh.ly_do_huy,
        recipient: dh.nguoi_nhan,
        cancelRequests: orderCancelRequests.map(y => ({
          id: y.ma_yc_huy,
          reason: y.ly_do_kh,
          status: y.trang_thai,
          requestedAt: y.ngay_yeu_cau,
          rejectReason: y.ly_do_xu_ly,
          processedAt: y.ngay_xu_ly,
        })),
        refunds: orderRefunds.map(r => ({
          id: r.ma_hoan_tien,
          amount: r.so_tien,
          status: r.trang_thai,
          reason: r.ly_do,
          processedAt: r.ngay_xu_ly,
        })),
        items: enrichedItemsByOrderId.get(dh.ma_dh) || [],
        codes: orderCodes.map(c => {
          // Note: for list view we might not need full review/complaint details, but we can pass basic hasReviewed/hasComplained if needed.
          // However, to keep it fast, we can just pass the basic fields.
          return {
            voucherMuaId: c.ma_voucher_mua,
            voucherId: c.ma_voucher,
            code: c.voucher_code,
            status: c.trang_thai,
            issuedAt: c.thoi_gian_sinh_ma,
            usedAt: c.ngay_su_dung,
            usedBranch: firstRelation(c.chinhanh)?.ten_chi_nhanh || null,
          };
        }),
      };
    });

    return { orders, total: count || 0 };
  }

  // -----------------------------------------------------------------------
  // 2. KHÁCH HÀNG: CHI TIẾT 1 ĐƠN HÀNG
  // -----------------------------------------------------------------------
  async findCustomerOrderById(accountId, orderId) {
    const { data: dh, error } = await supabase
      .from('donhang')
      .select('*')
      .eq('ma_dh', orderId)
      .maybeSingle();

    if (error || !dh) return null;
    if (dh.ma_tk_dat !== accountId) {
      throw new Error('Forbidden: Không có quyền truy cập đơn hàng này');
    }

    const extra = await fetchOrderExtraDetails(dh);

    const { data: rawItems } = await supabase
      .from('chitietdonhang')
      .select('*')
      .eq('ma_dh', orderId);

    const items = await enrichOrderItems(rawItems);

    const { data: codes } = await supabase
      .from('voucher_mua')
      .select(`
        ma_voucher_mua,
        ma_voucher,
        voucher_code,
        trang_thai,
        thoi_gian_sinh_ma,
        ngay_su_dung,
        chinhanh:ma_chi_nhanh_su_dung ( ten_chi_nhanh )
      `)
      .eq('ma_dh', orderId);

    const codeIds = (codes || []).map(c => c.ma_voucher_mua);
    let complaints = [];
    if (codeIds.length > 0) {
      const { data: compData } = await supabase
        .from('khieunai')
        .select('*')
        .in('ma_voucher_mua', codeIds)
        .order('ngay_khieu_nai', { ascending: false });
      complaints = compData || [];
    }

    let reviews = [];
    if (codeIds.length > 0) {
      const { data: revData } = await supabase
        .from('danhgia')
        .select('ma_voucher_mua, diem, noi_dung')
        .in('ma_voucher_mua', codeIds);
      reviews = revData || [];
    }

    const latestPayment = extra.payments[0] || null;

    return {
      id: dh.ma_dh,
      createdAt: dh.ngay_dat,
      orderStatus: dh.trang_thai,
      displayStatus: getCustomerOrderDisplayStatus(dh.trang_thai, extra.cancelRequests),
      paymentStatus: latestPayment ? latestPayment.trang_thai : PaymentStatus.DANG_XU_LY,
      total: dh.tong_tien,
      cancelReason: dh.ly_do_huy,
      recipient: dh.nguoi_nhan,
      items,
      cancelRequests: extra.cancelRequests.map(y => ({
        id: y.ma_yc_huy,
        reason: y.ly_do_kh,
        status: y.trang_thai,
        requestedAt: y.ngay_yeu_cau,
        rejectReason: y.ly_do_xu_ly,
        processedAt: y.ngay_xu_ly,
      })),
      refunds: extra.refunds.map(r => ({
        id: r.ma_hoan_tien,
        amount: r.so_tien,
        status: r.trang_thai,
        reason: r.ly_do,
        processedAt: r.ngay_xu_ly,
      })),
      complaints: complaints.map(k => {
        const purchasedVoucher = (codes || []).find(c => c.ma_voucher_mua === k.ma_voucher_mua);
        const orderItem = purchasedVoucher
          ? items.find(item => item.voucherId === purchasedVoucher.ma_voucher)
          : null;
        return {
          id: k.ma_khieu_nai,
          voucherMuaId: k.ma_voucher_mua,
          voucherId: purchasedVoucher?.ma_voucher || null,
          voucherCode: purchasedVoucher?.voucher_code || null,
          voucherName: orderItem?.voucherName || 'Voucher',
          voucherImage: orderItem?.image || null,
          content: k.noi_dung,
          status: k.trang_thai,
          createdAt: k.ngay_khieu_nai,
          rejectReason: k.ly_do_tu_choi_kn || null,
        };
      }),
      codes: (codes || []).map(c => {
        const relatedComplaint = complaints.find(k => k.ma_voucher_mua === c.ma_voucher_mua);
        const relatedReview = reviews.find(r => r.ma_voucher_mua === c.ma_voucher_mua);
        return {
          voucherMuaId: c.ma_voucher_mua,
          voucherId: c.ma_voucher,
          code: c.voucher_code,
          status: c.trang_thai,
          issuedAt: c.thoi_gian_sinh_ma,
          usedAt: c.ngay_su_dung,
          usedBranch: c.chinhanh?.ten_chi_nhanh || null,
          hasReviewed: !!relatedReview,
          reviewDetails: relatedReview ? {
            rating: relatedReview.diem,
            content: relatedReview.noi_dung
          } : null,
          hasComplained: !!relatedComplaint,
          complaintStatus: relatedComplaint ? relatedComplaint.trang_thai : null,
          complaintDate: relatedComplaint ? relatedComplaint.ngay_khieu_nai : null,
        }
      }),
      payments: extra.payments,
    };
  }

  // -----------------------------------------------------------------------
  // 3. ADMIN: DANH SÁCH ĐƠN HÀNG TOÀN HỆ THỐNG
  // -----------------------------------------------------------------------
  async findAdminOrders({ search, orderStatus, paymentStatus, voucherCodeStatus, page = 1, limit = 10 } = {}) {
    const pageNumber = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    // Action Center phải độc lập với bộ lọc của bảng, vì vậy vẫn lấy tập đơn
    // toàn hệ thống. PostgREST tổng hợp toàn bộ quan hệ bằng một request thay vì
    // chạy nhiều truy vấn cho từng đơn/từng voucher (N+1 queries).
    const { data: orderRows, error } = await supabase
      .from('donhang')
      .select(`
        ma_dh,
        ngay_dat,
        tong_tien,
        trang_thai,
        ly_do_huy,
        nguoi_nhan,
        ma_tk_dat,
        taikhoan:ma_tk_dat (
          nguoidung:ma_nguoi_dung (ho_ten, email, sdt)
        ),
        chitietdonhang (
          ma_voucher,
          so_luong,
          gia_tai_thoi_diem_mua,
          voucher:ma_voucher (
            ten_voucher,
            mo_ta,
            hinh_anh_url,
            dieu_kien_ap_dung,
            voucher_cn (
              chinhanh:ma_chi_nhanh (
                hosodn:ma_hs (ten_dn)
              )
            )
          ),
          voucher_mua (
            ma_voucher_mua,
            ma_voucher,
            voucher_code,
            trang_thai,
            thoi_gian_sinh_ma,
            khieunai (
              ma_khieu_nai,
              noi_dung,
              trang_thai,
              ngay_khieu_nai
            )
          )
        ),
        thanhtoan (
          ma_thanh_toan,
          trang_thai,
          phuong_thuc_tt,
          thoi_gian_tt,
          hoantien (
            ma_hoan_tien,
            so_tien,
            ly_do,
            trang_thai,
            ngay_xu_ly,
            cong_thanh_toan,
            nguon
          )
        ),
        yeucauhuy (
          ma_yc_huy,
          ly_do_kh,
          trang_thai,
          ngay_yeu_cau
        )
      `)
      .order('ngay_dat', { ascending: false });

    if (error) {
      throw new Error(`Lỗi lấy danh sách đơn hàng admin: ${error.message}`);
    }

    if (!orderRows?.length) {
      return { orders: [], total: 0, actionCenter: { refunds: [], codeErrors: [], complaints: [] } };
    }

    const allOrders = orderRows.map((dh) => {
      const account = firstRelation(dh.taikhoan);
      const user = firstRelation(account?.nguoidung);
      const customerName = user?.ho_ten || dh.nguoi_nhan || 'Khách vãng lai';
      const customerEmail = user?.email || '';

      const rawItems = relationRows(dh.chitietdonhang);
      const items = rawItems.map((item) => {
        const voucher = firstRelation(item.voucher) || {};
        const voucherBranch = voucher.voucher_cn?.[0];
        const branch = firstRelation(voucherBranch?.chinhanh);
        const partner = firstRelation(branch?.hosodn);
        return {
          voucherId: item.ma_voucher,
          voucherName: voucher.ten_voucher || 'Voucher',
          description: voucher.mo_ta || '',
          image: voucher.hinh_anh_url || '',
          terms: voucher.dieu_kien_ap_dung || '',
          partnerName: partner?.ten_dn || 'Đối tác',
          quantity: item.so_luong || 1,
          unitPrice: item.gia_tai_thoi_diem_mua || 0,
        };
      });

      const payments = sortByDateDesc(relationRows(dh.thanhtoan), 'thoi_gian_tt');
      const latestPayment = payments[0] || null;
      const refunds = sortByDateDesc(
        payments
          .flatMap((payment) => relationRows(payment.hoantien))
          .filter((refund) => ['Cho xu ly', 'Dang xu ly', 'Can kiem tra', 'That bai'].includes(refund.trang_thai)),
        'ngay_xu_ly',
      );
      const codes = rawItems.flatMap((item) => relationRows(item.voucher_mua));
      const complaints = sortByDateDesc(
        codes
          .flatMap((code) => relationRows(code.khieunai).map((complaint) => ({
            ...complaint,
            ma_voucher_mua: code.ma_voucher_mua,
          })))
          .filter((complaint) => ['Moi', 'Dang xu ly'].includes(complaint.trang_thai)),
        'ngay_khieu_nai',
      );
      const pendingCancelRequest = sortByDateDesc(
        relationRows(dh.yeucauhuy).filter((request) => request.trang_thai === 'Cho xu ly'),
        'ngay_yeu_cau',
      )[0] || null;
      const pendingRefund = refunds[0] || null;
      const firstItem = items[0] || {};
      const aggregateCodeStatus = getAggregateVoucherCodeStatus(codes);

      return {
        id: dh.ma_dh,
        createdAt: dh.ngay_dat,
        customerName,
        customerEmail,
        voucherName: firstItem.voucherName || 'Nhiều voucher',
        partnerName: firstItem.partnerName || 'Đối tác',
        total: dh.tong_tien,
        orderStatus: dh.trang_thai,
        paymentStatus: latestPayment ? latestPayment.trang_thai : PaymentStatus.DANG_XU_LY,
        paymentMethod: latestPayment?.phuong_thuc_tt || null,
        voucherCodeStatus: aggregateCodeStatus,
        items,
        codes: codes.map((code) => ({
          id: code.ma_voucher_mua,
          code: code.trang_thai === VoucherCodeStatus.LOI_SINH_MA ? null : code.voucher_code,
          status: code.trang_thai,
          issuedAt: code.thoi_gian_sinh_ma,
        })),
        pendingCancelRequest: pendingCancelRequest ? {
          id: pendingCancelRequest.ma_yc_huy,
          reason: pendingCancelRequest.ly_do_kh,
          status: pendingCancelRequest.trang_thai,
          requestedAt: pendingCancelRequest.ngay_yeu_cau,
        } : null,
        pendingRefund: pendingRefund ? {
          id: pendingRefund.ma_hoan_tien,
          amount: pendingRefund.so_tien,
          reason: pendingRefund.ly_do,
          status: pendingRefund.trang_thai,
          requestedAt: pendingRefund.ngay_xu_ly || dh.ngay_dat,
          gateway: pendingRefund.cong_thanh_toan,
          source: pendingRefund.nguon,
        } : null,
        activeComplaints: complaints.map((complaint) => ({
          id: complaint.ma_khieu_nai,
          voucherPurchaseId: complaint.ma_voucher_mua,
          content: complaint.noi_dung,
          status: complaint.trang_thai,
          createdAt: complaint.ngay_khieu_nai,
        })),
        hasActiveComplaint: complaints.length > 0,
      };
    });

    const actionCenter = {
      refunds: allOrders.flatMap((order) => {
        const items = [];
        if (order.pendingCancelRequest) {
          items.push({
            ...order.pendingCancelRequest,
            type: 'cancel_request',
            orderId: order.id,
            customerName: order.customerName,
            voucherName: order.voucherName,
            partnerName: order.partnerName,
            total: order.total,
            hasUsedVoucherCode: order.codes.some(
              (code) => code.status === VoucherCodeStatus.DA_SU_DUNG,
            ),
          });
        }
        if (order.pendingRefund) {
          items.push({
            ...order.pendingRefund,
            type: 'refund',
            orderId: order.id,
            customerName: order.customerName,
            voucherName: order.voucherName,
            partnerName: order.partnerName,
            total: order.total,
          });
        }
        return items;
      }),
      codeErrors: allOrders.flatMap((order) => order.codes
        .filter((code) => code.status === VoucherCodeStatus.LOI_SINH_MA
          && order.orderStatus === OrderStatus.DA_THANH_TOAN
          && order.paymentStatus === PaymentStatus.THANH_CONG)
        .map((code) => ({
          id: code.id,
          orderId: order.id,
          customerName: order.customerName,
          voucherName: order.voucherName,
          partnerName: order.partnerName,
          total: order.total,
          reason: 'Đã thanh toán nhưng hệ thống chưa thể sinh mã voucher.',
          createdAt: code.issuedAt || order.createdAt,
        }))),
      complaints: allOrders.flatMap((order) => order.activeComplaints.map((complaint) => ({
        ...complaint,
        orderId: order.id,
        customerName: order.customerName,
        voucherName: order.voucherName,
        partnerName: order.partnerName,
        total: order.total,
      }))),
    };

    let orders = allOrders;

    if (orderStatus) {
      orders = orders.filter((order) => order.orderStatus === orderStatus);
    }

    if (search) {
      const s = removeDiacritics(search);
      orders = orders.filter(o =>
        removeDiacritics(o.id).includes(s) ||
        removeDiacritics(o.customerName).includes(s) ||
        removeDiacritics(o.voucherName).includes(s) ||
        removeDiacritics(o.partnerName).includes(s)
      );
    }
    if (paymentStatus) {
      orders = orders.filter(o => o.paymentStatus === paymentStatus);
    }
    if (voucherCodeStatus) {
      orders = orders.filter(o => o.voucherCodeStatus === voucherCodeStatus);
    }

    const total = orders.length;
    const offset = (pageNumber - 1) * pageSize;

    return {
      orders: orders.slice(offset, offset + pageSize),
      total,
      actionCenter,
    };
  }

  // -----------------------------------------------------------------------
  // 4. ADMIN: CHI TIẾT ĐƠN HÀNG ĐẦY ĐỦ
  // -----------------------------------------------------------------------
  async findAdminOrderById(orderId) {
    const { data: dh, error } = await supabase
      .from('donhang')
      .select(`
        ma_dh,
        ngay_dat,
        tong_tien,
        trang_thai,
        ly_do_huy,
        nguoi_nhan,
        ma_tk_dat,
        taikhoan:ma_tk_dat (
          nguoidung:ma_nguoi_dung (ho_ten, email, sdt)
        ),
        chitietdonhang (
          ma_voucher,
          so_luong,
          gia_tai_thoi_diem_mua,
          voucher:ma_voucher (
            ten_voucher,
            mo_ta,
            hinh_anh_url,
            dieu_kien_ap_dung,
            voucher_cn (
              chinhanh:ma_chi_nhanh (
                hosodn:ma_hs (ten_dn)
              )
            )
          ),
          voucher_mua (
            ma_voucher_mua,
            ma_voucher,
            voucher_code,
            trang_thai,
            thoi_gian_sinh_ma,
            ngay_su_dung,
            chinhanh:ma_chi_nhanh_su_dung (ten_chi_nhanh),
            lssinhma (ma_ls, voucher_code_cu, voucher_code_moi, tg_thuc_hien),
            khieunai (
              ma_khieu_nai,
              noi_dung,
              trang_thai,
              ngay_khieu_nai,
              ma_tk_xuly,
              ly_do_tu_choi_kn
            ),
            danhgia (diem, noi_dung)
          )
        ),
        thanhtoan (
          ma_thanh_toan,
          thoi_gian_tt,
          so_tien,
          phuong_thuc_tt,
          trang_thai,
          ma_gd_goc,
          hoantien (
            ma_hoan_tien,
            so_tien,
            trang_thai,
            ly_do,
            ngay_xu_ly,
            ma_tk,
            ma_thanh_toan,
            cong_thanh_toan,
            ma_gd_hoan,
            ma_phan_hoi,
            nguon,
            ma_yc_huy,
            ma_khieu_nai
          )
        ),
        yeucauhuy (
          ma_yc_huy,
          ngay_yeu_cau,
          ly_do_kh,
          trang_thai,
          ly_do_xu_ly,
          ngay_xu_ly
        )
      `)
      .eq('ma_dh', orderId)
      .maybeSingle();

    if (error || !dh) return null;

    const account = firstRelation(dh.taikhoan);
    const user = firstRelation(account?.nguoidung);
    const rawItems = relationRows(dh.chitietdonhang);
    const items = rawItems.map((item) => {
      const voucher = firstRelation(item.voucher) || {};
      const voucherBranch = relationRows(voucher.voucher_cn)[0];
      const branch = firstRelation(voucherBranch?.chinhanh);
      const partner = firstRelation(branch?.hosodn);
      return {
        voucherId: item.ma_voucher,
        voucherName: voucher.ten_voucher || 'Voucher',
        description: voucher.mo_ta || '',
        image: voucher.hinh_anh_url || '',
        terms: voucher.dieu_kien_ap_dung || '',
        partnerName: partner?.ten_dn || 'Đối tác',
        quantity: item.so_luong || 1,
        unitPrice: item.gia_tai_thoi_diem_mua || 0,
      };
    });

    const codes = rawItems.flatMap((item) => relationRows(item.voucher_mua));
    const complaints = codes.flatMap((code) => relationRows(code.khieunai).map((complaint) => ({
      ...complaint,
      ma_voucher_mua: code.ma_voucher_mua,
    })));
    const codeHistory = sortByDateDesc(
      codes.flatMap((code) => relationRows(code.lssinhma)),
      'tg_thuc_hien',
    );
    const payments = sortByDateDesc(relationRows(dh.thanhtoan), 'thoi_gian_tt');
    const refunds = sortByDateDesc(
      payments.flatMap((payment) => relationRows(payment.hoantien)),
      'ngay_xu_ly',
    );
    const cancelRequests = sortByDateDesc(relationRows(dh.yeucauhuy), 'ngay_yeu_cau');
    const paymentById = new Map(payments.map((payment) => [payment.ma_thanh_toan, payment]));
    const latestPayment = payments[0] || null;
    const latestRefund = refunds[0] || null;

    const firstItem = items[0] || {};

    return {
      id: dh.ma_dh,
      createdAt: dh.ngay_dat,
      customerName: user?.ho_ten || dh.nguoi_nhan || 'Khách vãng lai',
      customerEmail: user?.email || '',
      customerPhone: user?.sdt || '',
      voucherName: firstItem.voucherName || 'Nhiều voucher',
      partnerName: firstItem.partnerName || 'Đối tác',
      total: dh.tong_tien,
      orderStatus: dh.trang_thai,
      paymentStatus: latestPayment ? latestPayment.trang_thai : PaymentStatus.DANG_XU_LY,
      voucherCodeStatus: getAggregateVoucherCodeStatus(codes),
      voucherCode: codes.length > 0 ? codes[0].voucher_code : null,
      paymentMethod: latestPayment?.phuong_thuc_tt || null,
      items,
      codes: codes.map(c => {
        const relatedComplaint = firstRelation(c.khieunai);
        const relatedReview = firstRelation(c.danhgia);
        const usedBranch = firstRelation(c.chinhanh);
        return {
          id: c.ma_voucher_mua,
          voucherId: c.ma_voucher,
          code: c.trang_thai === VoucherCodeStatus.LOI_SINH_MA ? null : c.voucher_code,
          status: c.trang_thai,
          timestamp: c.thoi_gian_sinh_ma,
          usedBranch: usedBranch?.ten_chi_nhanh || null,
          hasReviewed: !!relatedReview,
          reviewDetails: relatedReview ? {
            rating: relatedReview.diem,
            content: relatedReview.noi_dung
          } : null,
          hasComplained: !!relatedComplaint,
          complaintStatus: relatedComplaint ? relatedComplaint.trang_thai : null,
          complaintDate: relatedComplaint ? relatedComplaint.ngay_khieu_nai : null,
        }
      }),
      paymentHistory: payments.map(p => ({
        id: p.ma_thanh_toan,
        timestamp: p.thoi_gian_tt,
        action: 'Giao dịch thanh toán',
        amount: p.so_tien,
        status: p.trang_thai,
        method: p.phuong_thuc_tt,
      })),
      codeHistory: codeHistory.map(h => ({
        id: h.ma_ls,
        timestamp: h.tg_thuc_hien,
        action: !h.voucher_code_cu
          ? 'Sinh mã lần đầu'
          : h.voucher_code_cu === h.voucher_code_moi
            ? 'Gửi lại mã hiện tại'
            : 'Cấp lại mã mới',
        oldCode: h.voucher_code_cu,
        code: h.voucher_code_moi,
        status: VoucherCodeStatus.CHUA_SU_DUNG,
      })),
      refundRequest: latestRefund ? {
        id: latestRefund.ma_hoan_tien,
        requestedAt: latestRefund.ngay_xu_ly || dh.ngay_dat,
        reason: latestRefund.ly_do || dh.ly_do_huy || 'Yêu cầu từ hệ thống/khách hàng',
        status: latestRefund.trang_thai,
        amount: latestRefund.so_tien,
        gateway: latestRefund.cong_thanh_toan,
        maGdHoan: latestRefund.ma_gd_hoan,
        responseCode: latestRefund.ma_phan_hoi,
        nguon: latestRefund.nguon,
        maYcHuy: latestRefund.ma_yc_huy,
        maKhieuNai: latestRefund.ma_khieu_nai,
      } : (dh.ly_do_huy ? { requestedAt: dh.ngay_dat, reason: dh.ly_do_huy } : null),
      refunds: refunds.map(r => ({
        id: r.ma_hoan_tien,
        amount: r.so_tien,
        status: r.trang_thai,
        reason: r.ly_do,
        processedAt: r.ngay_xu_ly,
        gateway: r.cong_thanh_toan,
        maGdHoan: r.ma_gd_hoan,
        responseCode: r.ma_phan_hoi,
        nguon: r.nguon,
        maYcHuy: r.ma_yc_huy,
        maKhieuNai: r.ma_khieu_nai,
        maTkAdmin: r.ma_tk,
        paymentId: r.ma_thanh_toan,
        originalTransactionId: paymentById.get(r.ma_thanh_toan)?.ma_gd_goc || null,
        paymentAt: paymentById.get(r.ma_thanh_toan)?.thoi_gian_tt || null,
      })),
      cancelRequests: cancelRequests.map(y => ({
        id: y.ma_yc_huy,
        reason: y.ly_do_kh,
        status: y.trang_thai,
        requestedAt: y.ngay_yeu_cau,
        processingReason: y.ly_do_xu_ly || null,
        approvalReason: y.trang_thai === 'Da chap nhan' ? y.ly_do_xu_ly : null,
        rejectReason: y.trang_thai === 'Da tu choi' ? y.ly_do_xu_ly : null,
        processedAt: y.ngay_xu_ly,
      })),
      complaints: complaints.map(k => ({
        id: k.ma_khieu_nai,
        voucherPurchaseId: k.ma_voucher_mua,
        content: k.noi_dung,
        status: k.trang_thai,
        createdAt: k.ngay_khieu_nai,
        handlerId: k.ma_tk_xuly,
        rejectReason: k.ly_do_tu_choi_kn || null,
      })),
    };
  }

  // -----------------------------------------------------------------------
  // 5. THAO TÁC NGHIỆP VỤ: KHIẾU NAI & ĐÁNH GIÁ
  // -----------------------------------------------------------------------
  async insertComplaint({ maVoucherMua, noiDung, maTk }) {
    const { data, error } = await supabase
      .from('khieunai')
      .insert({
        noi_dung: noiDung,
        trang_thai: 'Moi',
        ma_voucher_mua: maVoucherMua,
        ma_tk_xuly: null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        const err = new Error('Bạn đã gửi khiếu nại cho voucher này rồi.');
        err.status = 400;
        throw err;
      }
      throw new Error(`Lỗi gửi khiếu nại: ${error.message}`);
    }
    return data;
  }

  async insertReview({ maVoucherMua, diem, noiDung, maTk }) {
    const { data, error } = await supabase
      .from('danhgia')
      .insert({
        diem,
        noi_dung: noiDung,
        ma_voucher_mua: maVoucherMua,
        ma_tk_danhgia: maTk,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        const err = new Error('Bạn đã gửi đánh giá cho voucher này rồi.');
        err.status = 400;
        throw err;
      }
      throw new Error(`Lỗi gửi đánh giá: ${error.message}`);
    }
    return data;
  }

  // -----------------------------------------------------------------------
  // 6. XỬ LÝ NGHIỆP VỤ ADMIN: A4a, A4b, A4c, A4d
  // -----------------------------------------------------------------------
  async updatePaymentStatusAndGenerateCodes(maDh, newStatus, reason, maTkAdmin) {
    const { data: dh } = await supabase.from('donhang').select('tong_tien').eq('ma_dh', maDh).single();
    if (!dh) throw new Error('Không tìm thấy đơn hàng');

    const orderStatus = newStatus === PaymentStatus.THANH_CONG ? OrderStatus.DA_THANH_TOAN : OrderStatus.CHO_THANH_TOAN;

    const operations = [
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('thanhtoan').insert({
            so_tien: dh.tong_tien,
            phuong_thuc_tt: 'manual_admin',
            trang_thai: newStatus,
            ma_dh: maDh,
          }).select().single();
          if (error) throw error;
          return data;
        },
        rollback: async (tx, result) => {
          if (result) await tx.from('thanhtoan').delete().eq('ma_thanh_toan', result.ma_thanh_toan);
        }
      },
      {
        execute: async (tx) => {
          const { data: oldDh } = await tx.from('donhang').select('trang_thai').eq('ma_dh', maDh).single();
          const { error } = await tx.from('donhang').update({ trang_thai: orderStatus }).eq('ma_dh', maDh);
          if (error) throw error;
          return oldDh?.trang_thai;
        },
        rollback: async (tx, oldStatus) => {
          if (oldStatus) await tx.from('donhang').update({ trang_thai: oldStatus }).eq('ma_dh', maDh);
        }
      }
    ];

    if (newStatus === PaymentStatus.THANH_CONG) {
      const { data: items } = await supabase.from('chitietdonhang').select('*').eq('ma_dh', maDh);
      for (const item of (items || [])) {
        for (let i = 0; i < item.so_luong; i++) {
          operations.push({
            execute: async (tx) => {
              const randomCode = `EC26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
              const { data, error } = await tx.from('voucher_mua').insert({
                ma_dh: maDh,
                ma_voucher: item.ma_voucher,
                voucher_code: randomCode,
                trang_thai: VoucherCodeStatus.CHUA_SU_DUNG,
              }).select().single();
              if (error) throw error;
              return data;
            },
            rollback: async (tx, result) => {
              if (result) await tx.from('voucher_mua').delete().eq('ma_voucher_mua', result.ma_voucher_mua);
            }
          });
        }
      }
    }

    const results = await withSupabaseTransaction(operations);
    return results[0];
  }


  // -----------------------------------------------------------------------
  // 7. CUSTOMER: TẠO YÊU CẦU HỦY (UC-ADM-05 luồng khách hàng)
  // -----------------------------------------------------------------------
  async createCancelRequest(maDh, lyDo, maTkKhach) {
    const { data: usedCodes, error: usedCodesError } = await supabase
      .from('voucher_mua')
      .select('ma_voucher_mua')
      .eq('ma_dh', maDh)
      .eq('trang_thai', VoucherCodeStatus.DA_SU_DUNG)
      .limit(1);
    if (usedCodesError) {
      throw new Error(`Không thể kiểm tra điều kiện hủy đơn: ${usedCodesError.message}`);
    }
    if (usedCodes?.length) {
      const conflict = new Error('Đơn hàng có voucher đã sử dụng nên không thể yêu cầu hủy/hoàn tiền.');
      conflict.status = 409;
      conflict.errorCode = 'VOUCHER_ALREADY_USED';
      throw conflict;
    }

    const { data, error } = await supabase
      .from('yeucauhuy')
      .insert({
        ma_dh: maDh,
        ly_do_kh: lyDo || 'Khách hàng yêu cầu hủy đơn',
        trang_thai: 'Cho xu ly',
        ngay_yeu_cau: new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw new Error(`Lỗi tạo yêu cầu hủy: ${error.message}`);
    return data;
  }

  // -----------------------------------------------------------------------
  // 8. ADMIN: DUYỆT YÊU CẦU HỦY (UC-ADM-05 — chấp nhận)
  // Kết quả: YEUCAUHUY→Đã chấp nhận, DONHANG→Chờ hoàn tiền, HOANTIEN→Chờ xử lý
  // -----------------------------------------------------------------------
  async approveYeuCauHuy(maYcHuy, reason, maTkAdmin) {
    const { data: ycHuy } = await supabase.from('yeucauhuy').select('*').eq('ma_yc_huy', maYcHuy).single();
    if (!ycHuy) throw new Error('Không tìm thấy yêu cầu hủy');
    if (ycHuy.trang_thai !== 'Cho xu ly') throw new Error('Yêu cầu hủy không ở trạng thái Chờ xử lý');

    const { data: dh } = await supabase.from('donhang').select('trang_thai, tong_tien').eq('ma_dh', ycHuy.ma_dh).single();
    if (!dh) throw new Error('Không tìm thấy đơn hàng');
    if (dh.trang_thai !== OrderStatus.DA_THANH_TOAN) {
      throw new Error('Chỉ xử lý yêu cầu hủy của đơn đã thanh toán và chưa chuyển sang hoàn tiền');
    }

    const { data: usedCodes, error: usedCodesError } = await supabase.from('voucher_mua')
      .select('ma_voucher_mua')
      .eq('ma_dh', ycHuy.ma_dh)
      .eq('trang_thai', VoucherCodeStatus.DA_SU_DUNG)
      .limit(1);
    if (usedCodesError) {
      throw new Error(`Không thể kiểm tra điều kiện hoàn tiền: ${usedCodesError.message}`);
    }
    if (usedCodes?.length) {
      const conflict = new Error('Đơn hàng có voucher đã sử dụng nên không đủ điều kiện hủy/hoàn tiền. Hãy từ chối yêu cầu hủy này.');
      conflict.status = 409;
      conflict.errorCode = 'VOUCHER_ALREADY_USED';
      throw conflict;
    }

    // Lấy giao dịch thanh toán thành công
    const { data: pays } = await supabase.from('thanhtoan')
      .select('*')
      .eq('ma_dh', ycHuy.ma_dh)
      .eq('trang_thai', PaymentStatus.THANH_CONG)
      .order('thoi_gian_tt', { ascending: false })
      .limit(1);
    const latestPay = pays?.[0] || null;
    if (!latestPay) {
      throw new Error('Không tìm thấy giao dịch thanh toán thành công của đơn hàng');
    }
    const { data: existingOrderRefunds } = await supabase.from('hoantien')
      .select('ma_hoan_tien')
      .eq('ma_thanh_toan', latestPay.ma_thanh_toan)
      .limit(1);
    if (existingOrderRefunds?.length) {
      throw new Error('Đơn hàng đã có yêu cầu hoàn tiền trước đó');
    }

    const operations = [
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('yeucauhuy')
            .update({ trang_thai: 'Da chap nhan', ly_do_xu_ly: reason, ngay_xu_ly: new Date().toISOString(), ma_tk_xuly: maTkAdmin })
            .eq('ma_yc_huy', maYcHuy)
            .eq('trang_thai', 'Cho xu ly')
            .select('ma_yc_huy')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật yêu cầu hủy: ${error.message}`);
          if (!data) throw new Error('Yêu cầu hủy đang được xử lý bởi một thao tác khác');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('yeucauhuy').update({ trang_thai: ycHuy.trang_thai, ly_do_xu_ly: null, ngay_xu_ly: null }).eq('ma_yc_huy', maYcHuy);
        }
      },
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('donhang')
            .update({ trang_thai: OrderStatus.CHO_HOAN_TIEN, ly_do_huy: reason })
            .eq('ma_dh', ycHuy.ma_dh)
            .eq('trang_thai', OrderStatus.DA_THANH_TOAN)
            .select('ma_dh')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật đơn hàng: ${error.message}`);
          if (!data) throw new Error('Đơn hàng đang được xử lý bởi một thao tác khác');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('donhang').update({ trang_thai: dh.trang_thai, ly_do_huy: null }).eq('ma_dh', ycHuy.ma_dh);
        }
      },
    ];

    operations.push({
      execute: async (tx) => {
        const { data, error } = await tx.from('hoantien').insert({
          so_tien: latestPay.so_tien,
          trang_thai: 'Cho xu ly',
          ly_do: reason,
          ma_thanh_toan: latestPay.ma_thanh_toan,
          cong_thanh_toan: latestPay.phuong_thuc_tt,
          nguon: 'Yeu cau huy',
          ma_yc_huy: maYcHuy,
        }).select().single();
        if (error) throw new Error(`Lỗi tạo bản ghi hoàn tiền: ${error.message}`);
        return data;
      },
      rollback: async (tx, result) => {
        if (result) await tx.from('hoantien').delete().eq('ma_hoan_tien', result.ma_hoan_tien);
      }
    });

    const results = await withSupabaseTransaction(operations);
    return { ycHuy: { ...ycHuy, trang_thai: 'Da chap nhan' }, hoanTien: results[2] || null };
  }

  // -----------------------------------------------------------------------
  // 9. ADMIN: TỪ CHỐI YÊU CẦU HỦY (UC-ADM-05 — A1)
  // -----------------------------------------------------------------------
  async rejectYeuCauHuy(maYcHuy, reason, maTkAdmin) {
    const { data: ycHuy } = await supabase.from('yeucauhuy').select('*').eq('ma_yc_huy', maYcHuy).single();
    if (!ycHuy) throw new Error('Không tìm thấy yêu cầu hủy');
    if (ycHuy.trang_thai !== 'Cho xu ly') throw new Error('Yêu cầu hủy không ở trạng thái Chờ xử lý');

    const { data: updatedRequest, error } = await supabase.from('yeucauhuy')
      .update({ trang_thai: 'Da tu choi', ly_do_xu_ly: reason, ngay_xu_ly: new Date().toISOString(), ma_tk_xuly: maTkAdmin })
      .eq('ma_yc_huy', maYcHuy)
      .eq('trang_thai', 'Cho xu ly')
      .select('ma_yc_huy')
      .maybeSingle();
    if (error) throw new Error(`Lỗi từ chối yêu cầu hủy: ${error.message}`);
    if (!updatedRequest) throw new Error('Yêu cầu hủy đang được xử lý bởi một thao tác khác');
    return { success: true, orderId: ycHuy.ma_dh };
  }

  // -----------------------------------------------------------------------
  // 10. ADMIN: THỰC HIỆN HOÀN TIỀN QUA SANDBOX (UC-ADM-06)
  // -----------------------------------------------------------------------
  async executeRefundViaSandbox(maHoanTien, maTkAdmin, sandboxResult) {
    // sandboxResult = { isSuccess, isPending, isTimeout, refundId, responseCode, transactionStatus, gateway }
    const { data: ht } = await supabase.from('hoantien').select('*').eq('ma_hoan_tien', maHoanTien).single();
    if (!ht) throw new Error('Không tìm thấy bản ghi hoàn tiền');

    const now = new Date().toISOString();
    const responseDetail = [sandboxResult.responseCode, sandboxResult.transactionStatus]
      .filter((value, index, values) => value && values.indexOf(value) === index)
      .join('/');

    if (sandboxResult.isTimeout || sandboxResult.isPending) {
      // Không xác định được kết quả hoặc cổng đang xử lý: tuyệt đối không gọi lại tự động.
      const { data, error } = await supabase.from('hoantien')
        .update({
          trang_thai: 'Can kiem tra',
          ma_tk: maTkAdmin,
          ngay_xu_ly: now,
          ma_gd_hoan: sandboxResult.refundId || null,
          ma_phan_hoi: responseDetail || sandboxResult.responseCode,
        })
        .eq('ma_hoan_tien', maHoanTien)
        .eq('trang_thai', 'Dang xu ly')
        .select('ma_hoan_tien')
        .maybeSingle();
      if (error) throw new Error(`Lỗi cập nhật trạng thái hoàn tiền: ${error.message}`);
      if (!data) throw new Error('Trạng thái hoàn tiền đã thay đổi trong lúc cổng thanh toán xử lý');
      return { outcome: 'can_kiem_tra' };
    }

    if (!sandboxResult.isSuccess) {
      // E2 — Cổng thanh toán từ chối dứt khoát.
      const { data, error } = await supabase.from('hoantien')
        .update({
          trang_thai: 'That bai',
          ma_tk: maTkAdmin,
          ngay_xu_ly: now,
          ma_gd_hoan: sandboxResult.refundId || null,
          ma_phan_hoi: responseDetail || sandboxResult.responseCode,
        })
        .eq('ma_hoan_tien', maHoanTien)
        .eq('trang_thai', 'Dang xu ly')
        .select('ma_hoan_tien')
        .maybeSingle();
      if (error) throw new Error(`Lỗi cập nhật trạng thái hoàn tiền: ${error.message}`);
      if (!data) throw new Error('Trạng thái hoàn tiền đã thay đổi trong lúc cổng thanh toán xử lý');
      return { outcome: 'that_bai' };
    }

    // Sandbox xác nhận thành công → cập nhật đồng loạt
    const { data: dh } = await supabase.from('donhang')
      .select('ma_dh, trang_thai')
      .eq('ma_dh', (await supabase.from('thanhtoan').select('ma_dh').eq('ma_thanh_toan', ht.ma_thanh_toan).single()).data?.ma_dh)
      .single();
    const { data: refundableCodes } = dh
      ? await supabase.from('voucher_mua')
        .select('ma_voucher_mua')
        .eq('ma_dh', dh.ma_dh)
        .eq('trang_thai', VoucherCodeStatus.CHUA_SU_DUNG)
      : { data: [] };
    const refundableCodeIds = (refundableCodes || []).map((code) => code.ma_voucher_mua);

    const operations = [
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('hoantien').update({
            trang_thai: 'Thanh cong',
            ma_tk: maTkAdmin,
            ngay_xu_ly: now,
            ma_gd_hoan: sandboxResult.refundId,
            ma_phan_hoi: responseDetail || sandboxResult.responseCode,
          })
            .eq('ma_hoan_tien', maHoanTien)
            .eq('trang_thai', 'Dang xu ly')
            .select('ma_hoan_tien')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật hoàn tiền: ${error.message}`);
          if (!data) throw new Error('Trạng thái hoàn tiền đã thay đổi trong lúc Sandbox xử lý');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('hoantien').update({
            trang_thai: ht.trang_thai,
            ma_tk: ht.ma_tk || null,
            ma_gd_hoan: ht.ma_gd_hoan || null,
            ma_phan_hoi: ht.ma_phan_hoi || null,
          }).eq('ma_hoan_tien', maHoanTien);
        }
      },
      {
        execute: async (tx) => {
          if (!dh) return;
          const { data, error } = await tx.from('donhang')
            .update({ trang_thai: OrderStatus.DA_HOAN_TIEN })
            .eq('ma_dh', dh.ma_dh)
            .eq('trang_thai', OrderStatus.CHO_HOAN_TIEN)
            .select('ma_dh')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật đơn hàng: ${error.message}`);
          if (!data) throw new Error('Đơn hàng không còn ở trạng thái Chờ hoàn tiền');
          return data;
        },
        rollback: async (tx) => {
          if (dh) await tx.from('donhang').update({ trang_thai: dh.trang_thai }).eq('ma_dh', dh.ma_dh);
        }
      },
      {
        execute: async (tx) => {
          if (!dh || refundableCodeIds.length === 0) return [];
          // Vô hiệu hóa voucher code chưa sử dụng
          const { data, error } = await tx.from('voucher_mua')
            .update({ trang_thai: VoucherCodeStatus.VO_HIEU_HOA })
            .in('ma_voucher_mua', refundableCodeIds)
            .eq('trang_thai', VoucherCodeStatus.CHUA_SU_DUNG)
            .select('ma_voucher_mua');
          if (error) throw error;
          return data || [];
        },
        rollback: async (tx, changedCodes) => {
          const changedIds = (changedCodes || []).map((code) => code.ma_voucher_mua);
          if (changedIds.length) {
            await tx.from('voucher_mua')
              .update({ trang_thai: VoucherCodeStatus.CHUA_SU_DUNG })
              .in('ma_voucher_mua', changedIds);
          }
        }
      },
    ];

    // Nếu hoàn tiền xuất phát từ khiếu nại → cập nhật khiếu nại thành Đã xử lý
    if (ht.ma_khieu_nai) {
      operations.push({
        execute: async (tx) => {
          const { data, error } = await tx.from('khieunai')
            .update({ trang_thai: 'Da xu ly' })
            .eq('ma_khieu_nai', ht.ma_khieu_nai)
            .eq('trang_thai', 'Dang xu ly')
            .select('ma_khieu_nai')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật khiếu nại: ${error.message}`);
          if (!data) throw new Error('Khiếu nại không còn ở trạng thái Đang xử lý');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('khieunai').update({ trang_thai: 'Dang xu ly' }).eq('ma_khieu_nai', ht.ma_khieu_nai);
        }
      });
    }

    try {
      await withSupabaseTransaction(operations);
      return { outcome: 'thanh_cong' };
    } catch (err) {
      // E6 — Sandbox thành công nhưng không update được DB → Can kiem tra
      await supabase.from('hoantien')
        .update({
          trang_thai: 'Can kiem tra',
          ma_tk: maTkAdmin,
          ma_gd_hoan: sandboxResult.refundId,
          ma_phan_hoi: responseDetail || sandboxResult.responseCode,
          ngay_xu_ly: now,
        })
        .eq('ma_hoan_tien', maHoanTien);
      const canKiemTraErr = new Error(`Sandbox hoàn tiền thành công nhưng cập nhật DB thất bại: ${err.message}`);
      canKiemTraErr.outcome = 'can_kiem_tra';
      throw canKiemTraErr;
    }
  }

  // -----------------------------------------------------------------------
  // 11. ADMIN: MỞ KHIẾU NẠI (UC-ADM-07 bước 3: Mới → Đang xử lý)
  // -----------------------------------------------------------------------
  async openComplaint(maKhieuNai, maTkAdmin) {
    const { data: kn } = await supabase.from('khieunai').select('*').eq('ma_khieu_nai', maKhieuNai).single();
    if (!kn) throw new Error('Không tìm thấy khiếu nại');
    if (kn.trang_thai !== 'Moi') throw new Error('Khiếu nại không ở trạng thái Mới');
    const { error } = await supabase.from('khieunai')
      .update({ trang_thai: 'Dang xu ly', ma_tk_xuly: maTkAdmin })
      .eq('ma_khieu_nai', maKhieuNai);
    if (error) throw new Error(`Lỗi mở khiếu nại: ${error.message}`);
    return { ...kn, trang_thai: 'Dang xu ly' };
  }

  // -----------------------------------------------------------------------
  // 12. ADMIN: GỬI LẠI MÃ (UC-ADM-07 — A1)
  // Chỉ gửi lại code hiện tại — không sinh mới
  // -----------------------------------------------------------------------
  async resendComplaintCode(maKhieuNai, maTkAdmin) {
    const { data: kn } = await supabase.from('khieunai').select('*, voucher_mua:ma_voucher_mua(*)').eq('ma_khieu_nai', maKhieuNai).single();
    if (!kn) throw new Error('Không tìm thấy khiếu nại');
    const vm = kn.voucher_mua;
    if (kn.trang_thai !== 'Dang xu ly') throw new Error('Khiếu nại chưa ở trạng thái Đang xử lý');
    if (!vm || vm.trang_thai !== VoucherCodeStatus.CHUA_SU_DUNG || !vm.voucher_code) {
      throw new Error('Không có voucher code hợp lệ, chưa sử dụng để gửi lại');
    }
    const { data: order } = await supabase.from('donhang')
      .select('trang_thai').eq('ma_dh', vm.ma_dh).single();
    if (order?.trang_thai !== OrderStatus.DA_THANH_TOAN) {
      throw new Error('Không thể gửi mã khi đơn hàng không còn ở trạng thái Đã thanh toán');
    }
    const { data: successfulPayments } = await supabase.from('thanhtoan')
      .select('ma_thanh_toan').eq('ma_dh', vm.ma_dh)
      .eq('trang_thai', PaymentStatus.THANH_CONG).limit(1);
    if (!successfulPayments?.length) throw new Error('Đơn hàng chưa có thanh toán thành công');

    // Chưa đổi trạng thái ở đây. Service phải gửi email thành công rồi mới gọi
    // completeComplaintCodeDelivery; nếu gửi lỗi, khiếu nại vẫn Đang xử lý (E1).
    return {
      voucherCode: vm.voucher_code,
      voucherPurchaseId: vm.ma_voucher_mua,
      orderId: vm.ma_dh,
    };
  }

  async getOrderCustomerDeliveryContext(maDh) {
    const { data: order, error: orderError } = await supabase
      .from('donhang')
      .select('ma_dh, ma_tk_dat')
      .eq('ma_dh', maDh)
      .single();
    if (orderError || !order) throw new Error('Không tìm thấy đơn hàng');

    const { data: account, error: accountError } = await supabase
      .from('taikhoan')
      .select('ma_nguoi_dung')
      .eq('ma_tk', order.ma_tk_dat)
      .single();
    if (accountError || !account) throw new Error('Không tìm thấy tài khoản khách hàng');

    const { data: customer, error: customerError } = await supabase
      .from('nguoidung')
      .select('ho_ten, email')
      .eq('ma_nguoi_dung', account.ma_nguoi_dung)
      .single();
    if (customerError || !customer?.email) {
      throw new Error('Khách hàng chưa có email hợp lệ để nhận thông báo');
    }

    return {
      orderId: order.ma_dh,
      customerName: customer.ho_ten,
      customerEmail: customer.email,
    };
  }

  async getComplaintDeliveryContext(maKhieuNai) {
    const { data: kn, error: complaintError } = await supabase
      .from('khieunai')
      .select('ma_khieu_nai, trang_thai, ma_voucher_mua')
      .eq('ma_khieu_nai', maKhieuNai)
      .single();
    if (complaintError || !kn) throw new Error('Không tìm thấy khiếu nại');

    const { data: vm, error: voucherError } = await supabase
      .from('voucher_mua')
      .select('ma_voucher_mua, ma_dh, ma_voucher, voucher_code, trang_thai, thoi_gian_sinh_ma')
      .eq('ma_voucher_mua', kn.ma_voucher_mua)
      .single();
    if (voucherError || !vm) throw new Error('Khiếu nại không liên kết voucher code hợp lệ');

    const [voucherResult, orderItemResult] = await Promise.all([
      supabase
        .from('voucher')
        .select('ten_voucher, dieu_kien_ap_dung, tg_bat_dau_ban, tg_ket_thuc_ban')
        .eq('ma_voucher', vm.ma_voucher)
        .maybeSingle(),
      supabase
        .from('chitietdonhang')
        .select('gia_tai_thoi_diem_mua')
        .eq('ma_dh', vm.ma_dh)
        .eq('ma_voucher', vm.ma_voucher)
        .maybeSingle(),
    ]);
    if (voucherResult.error) throw new Error(`Không thể tải thông tin voucher đã mua: ${voucherResult.error.message}`);
    if (orderItemResult.error) throw new Error(`Không thể tải giá voucher đã mua: ${orderItemResult.error.message}`);

    const customer = await this.getOrderCustomerDeliveryContext(vm.ma_dh);
    const voucher = voucherResult.data || {};
    const orderItem = orderItemResult.data || {};

    return {
      complaintId: kn.ma_khieu_nai,
      complaintStatus: kn.trang_thai,
      voucherPurchaseId: vm.ma_voucher_mua,
      voucherCode: vm.voucher_code,
      voucherStatus: vm.trang_thai,
      orderId: customer.orderId,
      customerName: customer.customerName,
      customerEmail: customer.customerEmail,
      qrValue: vm.voucher_code,
      voucherDetails: {
        name: voucher.ten_voucher || 'Voucher đã mua',
        orderId: vm.ma_dh,
        purchaseId: vm.ma_voucher_mua,
        purchasePrice: orderItem.gia_tai_thoi_diem_mua,
        status: vm.trang_thai,
        issuedAt: vm.thoi_gian_sinh_ma,
        validFrom: voucher.tg_bat_dau_ban,
        validUntil: voucher.tg_ket_thuc_ban,
        conditions: voucher.dieu_kien_ap_dung,
      },
    };
  }

  async completeComplaintCodeDelivery(maKhieuNai, maVoucherMua, voucherCode, maTkAdmin) {
    const operations = [
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('lssinhma').insert({
            voucher_code_cu: voucherCode,
            voucher_code_moi: voucherCode,
            tg_thuc_hien: new Date().toISOString(),
            ma_voucher_mua: maVoucherMua,
            ma_tk_admin: maTkAdmin,
          }).select('ma_ls').single();
          if (error) throw new Error(`Lỗi ghi lịch sử gửi: ${error.message}`);
          return data;
        },
        rollback: async (tx, result) => {
          if (result?.ma_ls) await tx.from('lssinhma').delete().eq('ma_ls', result.ma_ls);
        },
      },
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('khieunai')
            .update({ trang_thai: 'Da xu ly' })
            .eq('ma_khieu_nai', maKhieuNai)
            .eq('trang_thai', 'Dang xu ly')
            .select('ma_khieu_nai')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật khiếu nại: ${error.message}`);
          if (!data) throw new Error('Khiếu nại đã được xử lý bởi một yêu cầu khác');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('khieunai').update({ trang_thai: 'Dang xu ly' }).eq('ma_khieu_nai', maKhieuNai);
        },
      },
    ];

    await withSupabaseTransaction(operations);
    return { voucherCode };
  }

  // -----------------------------------------------------------------------
  // 13. ADMIN: CẤP LẠI MÃ MỚI (UC-ADM-07 — A2)
  // Vô hiệu hóa code cũ (nếu có) + sinh code mới + cập nhật KN → Đã xử lý
  // -----------------------------------------------------------------------
  async reissueComplaintCode(maKhieuNai, maTkAdmin) {
    const { data: kn } = await supabase.from('khieunai').select('*, voucher_mua:ma_voucher_mua(*)').eq('ma_khieu_nai', maKhieuNai).single();
    if (!kn) throw new Error('Không tìm thấy khiếu nại');
    const vm = kn.voucher_mua;
    if (!vm) throw new Error('Khiếu nại không liên kết voucher_mua');
    if (kn.trang_thai !== 'Dang xu ly') throw new Error('Khiếu nại chưa ở trạng thái Đang xử lý');
    if (![VoucherCodeStatus.LOI_SINH_MA, VoucherCodeStatus.HET_HAN, VoucherCodeStatus.VO_HIEU_HOA].includes(vm.trang_thai)) {
      throw new Error('Voucher code hiện tại vẫn hợp lệ; hãy dùng chức năng gửi lại mã');
    }
    const { data: order } = await supabase.from('donhang')
      .select('trang_thai').eq('ma_dh', vm.ma_dh).single();
    if (order?.trang_thai !== OrderStatus.DA_THANH_TOAN) {
      throw new Error('Không thể cấp mã mới khi đơn hàng không còn ở trạng thái Đã thanh toán');
    }
    const { data: successfulPayments } = await supabase.from('thanhtoan')
      .select('ma_thanh_toan').eq('ma_dh', vm.ma_dh)
      .eq('trang_thai', PaymentStatus.THANH_CONG).limit(1);
    if (!successfulPayments?.length) throw new Error('Đơn hàng chưa có thanh toán thành công');

    let newVm = null;
    const operations = [];

    // Vô hiệu hóa code cũ nếu còn tồn tại và chưa vô hiệu
    if (vm.trang_thai !== VoucherCodeStatus.VO_HIEU_HOA) {
      operations.push({
        execute: async (tx) => {
          const { error } = await tx.from('voucher_mua').update({ trang_thai: VoucherCodeStatus.VO_HIEU_HOA }).eq('ma_voucher_mua', vm.ma_voucher_mua);
          if (error) throw error;
        },
        rollback: async (tx) => {
          await tx.from('voucher_mua').update({ trang_thai: vm.trang_thai }).eq('ma_voucher_mua', vm.ma_voucher_mua);
        }
      });
    }

    // Sinh code mới
    operations.push({
      execute: async (tx) => {
        const newCode = `REC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const { data, error: errNew } = await tx.from('voucher_mua').insert({
          ma_dh: vm.ma_dh,
          ma_voucher: vm.ma_voucher,
          voucher_code: newCode,
          trang_thai: VoucherCodeStatus.CHUA_SU_DUNG,
        }).select().single();
        if (errNew) throw new Error(`Lỗi sinh mã mới: ${errNew.message}`);
        newVm = data;
        return data;
      },
      rollback: async (tx, result) => {
        if (result) await tx.from('voucher_mua').delete().eq('ma_voucher_mua', result.ma_voucher_mua);
      }
    });

    // Ghi lịch sử sinh mã
    operations.push({
      execute: async (tx) => {
        const { data, error } = await tx.from('lssinhma').insert({
          voucher_code_cu: vm.voucher_code,
          voucher_code_moi: newVm?.voucher_code,
          tg_thuc_hien: new Date().toISOString(),
          ma_voucher_mua: newVm?.ma_voucher_mua,
          ma_tk_admin: maTkAdmin,
        }).select('ma_ls').single();
        if (error) throw error;
        return data;
      },
      rollback: async (tx, result) => {
        if (result?.ma_ls) await tx.from('lssinhma').delete().eq('ma_ls', result.ma_ls);
      }
    });

    // Liên kết khiếu nại với code mới nhưng vẫn giữ Đang xử lý. Service chỉ
    // hoàn tất khiếu nại sau khi gửi code thành công (E3).
    operations.push({
      execute: async (tx) => {
        const { error } = await tx.from('khieunai')
          .update({ ma_voucher_mua: newVm?.ma_voucher_mua })
          .eq('ma_khieu_nai', maKhieuNai);
        if (error) throw new Error(`Lỗi liên kết code mới với khiếu nại: ${error.message}`);
      },
      rollback: async (tx) => {
        await tx.from('khieunai').update({ ma_voucher_mua: kn.ma_voucher_mua }).eq('ma_khieu_nai', maKhieuNai);
      }
    });

    await withSupabaseTransaction(operations);
    return newVm;
  }

  // -----------------------------------------------------------------------
  // 14. ADMIN: CHẤP NHẬN KHIẾU NẠI → HOÀN TIỀN (UC-ADM-07 — A3)
  // DONHANG → Chờ hoàn tiền, HOANTIEN tạo Chờ xử lý, KN giữ Đang xử lý
  // -----------------------------------------------------------------------
  async approveComplaintRefund(maKhieuNai, reason, maTkAdmin) {
    const { data: kn } = await supabase.from('khieunai').select('*, voucher_mua:ma_voucher_mua(ma_dh, trang_thai)').eq('ma_khieu_nai', maKhieuNai).single();
    if (!kn) throw new Error('Không tìm thấy khiếu nại');
    if (kn.trang_thai !== 'Dang xu ly') throw new Error('Khiếu nại không ở trạng thái Đang xử lý');

    const maDh = kn.voucher_mua?.ma_dh;
    if (!maDh) throw new Error('Khiếu nại không liên kết đơn hàng');
    if (kn.voucher_mua.trang_thai === VoucherCodeStatus.DA_SU_DUNG) {
      throw new Error('Voucher code đã được sử dụng nên không đủ điều kiện hoàn tiền');
    }

    const { data: dh } = await supabase.from('donhang').select('trang_thai, tong_tien').eq('ma_dh', maDh).single();
    if (!dh || dh.trang_thai !== OrderStatus.DA_THANH_TOAN) {
      throw new Error('Đơn hàng không còn ở trạng thái Đã thanh toán để chuyển sang hoàn tiền');
    }
    const { data: pays } = await supabase.from('thanhtoan')
      .select('*').eq('ma_dh', maDh).eq('trang_thai', PaymentStatus.THANH_CONG)
      .order('thoi_gian_tt', { ascending: false }).limit(1);
    const latestPay = pays?.[0] || null;
    if (!latestPay) throw new Error('Không tìm thấy giao dịch thanh toán thành công của đơn hàng');

    const { data: orderRefunds } = await supabase.from('hoantien')
      .select('ma_hoan_tien')
      .eq('ma_thanh_toan', latestPay.ma_thanh_toan)
      .limit(1);
    if (orderRefunds?.length) throw new Error('Đơn hàng đã có yêu cầu hoàn tiền trước đó');

    const { data: existingRefund } = await supabase.from('hoantien')
      .select('ma_hoan_tien')
      .eq('ma_khieu_nai', maKhieuNai)
      .limit(1);
    if (existingRefund?.length) throw new Error('Khiếu nại đã được chuyển sang hoàn tiền trước đó');

    const operations = [
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('donhang')
            .update({ trang_thai: OrderStatus.CHO_HOAN_TIEN })
            .eq('ma_dh', maDh)
            .eq('trang_thai', OrderStatus.DA_THANH_TOAN)
            .select('ma_dh')
            .maybeSingle();
          if (error) throw new Error(`Lỗi cập nhật đơn hàng: ${error.message}`);
          if (!data) throw new Error('Đơn hàng đang được xử lý bởi một thao tác khác');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('donhang').update({ trang_thai: dh.trang_thai }).eq('ma_dh', maDh);
        }
      },
    ];

    operations.push({
      execute: async (tx) => {
        const { data, error } = await tx.from('hoantien').insert({
          so_tien: latestPay.so_tien,
          trang_thai: 'Cho xu ly',
          ly_do: reason,
          ma_thanh_toan: latestPay.ma_thanh_toan,
          cong_thanh_toan: latestPay.phuong_thuc_tt,
          nguon: 'Khieu nai',
          ma_khieu_nai: maKhieuNai,
        }).select().single();
        if (error) throw new Error(`Lỗi tạo bản ghi hoàn tiền: ${error.message}`);
        return data;
      },
      rollback: async (tx, result) => {
        if (result) await tx.from('hoantien').delete().eq('ma_hoan_tien', result.ma_hoan_tien);
      }
    });

    const results = await withSupabaseTransaction(operations);
    return { hoanTien: results[1] || null };
  }

  // -----------------------------------------------------------------------
  // 15. ADMIN: TỪ CHỐI KHIẾU NẠI (UC-ADM-07 — A4)
  // -----------------------------------------------------------------------
  async rejectComplaint(maKhieuNai, reason, maTkAdmin) {
    const { data: kn } = await supabase.from('khieunai').select('*').eq('ma_khieu_nai', maKhieuNai).single();
    if (!kn) throw new Error('Không tìm thấy khiếu nại');
    if (!['Moi', 'Dang xu ly'].includes(kn.trang_thai)) throw new Error('Không thể từ chối khiếu nại ở trạng thái hiện tại');

    const { error } = await supabase.from('khieunai')
      .update({ trang_thai: 'Tu choi', ly_do_tu_choi_kn: reason, ma_tk_xuly: maTkAdmin })
      .eq('ma_khieu_nai', maKhieuNai);
    if (error) throw new Error(`Lỗi từ chối khiếu nại: ${error.message}`);
    return { success: true };
  }

  // Giữ lại hàm reissueVoucherCode cũ để dùng cho tính năng admin cấp lại mã qua đơn hàng
  async reissueVoucherCode(maVoucherMua, maTkAdmin) {
    const { data: oldVm, error: errVm } = await supabase
      .from('voucher_mua')
      .select('*')
      .eq('ma_voucher_mua', maVoucherMua)
      .single();

    if (errVm || !oldVm) throw new Error('Không tìm thấy mã voucher cần cấp lại');

    let newVm = null;

    const operations = [
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('voucher_mua')
            .update({ trang_thai: VoucherCodeStatus.VO_HIEU_HOA })
            .eq('ma_voucher_mua', maVoucherMua)
            .eq('trang_thai', oldVm.trang_thai)
            .select('ma_voucher_mua')
            .maybeSingle();
          if (error) throw error;
          if (!data) throw new Error('Voucher code đang được xử lý bởi một thao tác khác');
          return data;
        },
        rollback: async (tx) => {
          await tx.from('voucher_mua').update({ trang_thai: oldVm.trang_thai }).eq('ma_voucher_mua', maVoucherMua);
        }
      },
      {
        execute: async (tx) => {
          const newCode = `NEW-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          const { data, error: errNew } = await tx.from('voucher_mua').insert({
            ma_dh: oldVm.ma_dh,
            ma_voucher: oldVm.ma_voucher,
            voucher_code: newCode,
            trang_thai: VoucherCodeStatus.CHUA_SU_DUNG,
          }).select().single();
          if (errNew) throw new Error(`Lỗi sinh mã mới: ${errNew.message}`);
          newVm = data;
          return data;
        },
        rollback: async (tx, result) => {
          if (result) await tx.from('voucher_mua').delete().eq('ma_voucher_mua', result.ma_voucher_mua);
        }
      },
      {
        execute: async (tx) => {
          const { data, error } = await tx.from('lssinhma').insert({
            voucher_code_cu: oldVm.voucher_code,
            voucher_code_moi: newVm.voucher_code,
            tg_thuc_hien: new Date().toISOString(),
            ma_voucher_mua: newVm.ma_voucher_mua,
            ma_tk_admin: maTkAdmin,
          }).select().single();
          if (error) throw error;
          return data;
        },
        rollback: async (tx, result) => {
          if (result) await tx.from('lssinhma').delete().eq('ma_ls', result.ma_ls);
        }
      }
    ];

    await withSupabaseTransaction(operations);
    return newVm;
  }
}

module.exports = new OrderRepository();
