const supabase = require('../../../../config/supabase');

function removeDiacritics(str) {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

async function enrichOrderItems(items) {
  return await Promise.all((items || []).map(async (i) => {
    let voucherName = 'Voucher';
    let voucherDesc = '';
    let voucherImg = '';
    let partnerName = 'Đối tác';

    const voucherId = i.ma_voucher || i.voucherId;
    if (voucherId) {
      const { data: v } = await supabase
        .from('voucher')
        .select('ten_voucher, mo_ta, hinh_anh_url')
        .eq('ma_voucher', voucherId)
        .maybeSingle();
      if (v) {
        voucherName = v.ten_voucher || voucherName;
        voucherDesc = v.mo_ta || '';
        voucherImg = v.hinh_anh_url || '';
      }

      // Lấy tên đối tác qua voucher_cn -> chinhanh -> hosodn
      const { data: vcn } = await supabase
        .from('voucher_cn')
        .select('ma_chi_nhanh')
        .eq('ma_voucher', voucherId)
        .limit(1)
        .maybeSingle();

      if (vcn?.ma_chi_nhanh) {
        const { data: cn } = await supabase
          .from('chinhanh')
          .select('ma_hs')
          .eq('ma_chi_nhanh', vcn.ma_chi_nhanh)
          .maybeSingle();

        if (cn?.ma_hs) {
          const { data: hsdn } = await supabase
            .from('hosodn')
            .select('ten_dn')
            .eq('ma_hs', cn.ma_hs)
            .maybeSingle();

          if (hsdn?.ten_dn) {
            partnerName = hsdn.ten_dn;
          }
        }
      }
    }

    return {
      voucherId: voucherId,
      voucherName,
      description: voucherDesc,
      image: voucherImg,
      partnerName,
      quantity: i.so_luong || 1,
      unitPrice: i.gia_tai_thoi_diem_mua || 0,
    };
  }));
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

  const { data: payments } = await supabase
    .from('thanhtoan')
    .select('*')
    .eq('ma_dh', dh.ma_dh)
    .order('thoi_gian_tt', { ascending: false });

  const paymentIds = (payments || []).map(p => p.ma_thanh_toan);
  let refunds = [];
  if (paymentIds.length > 0) {
    const { data: refData } = await supabase
      .from('hoantien')
      .select('*')
      .in('ma_thanh_toan', paymentIds);
    refunds = refData || [];
  }

  return {
    customerName,
    customerEmail,
    customerPhone,
    payments: payments || [],
    refunds: refunds || [],
  };
}

class OrderRepository {
  // -----------------------------------------------------------------------
  // 1. KHÁCH HÀNG: LẤY DANH SÁCH ĐƠN HÀNG
  // -----------------------------------------------------------------------
  async findCustomerOrders(accountId, { status, page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from('donhang')
      .select('*', { count: 'exact' })
      .eq('ma_tk_dat', accountId)
      .order('ngay_dat', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== 'all') {
      query = query.eq('trang_thai', status);
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`Lỗi lấy danh sách đơn hàng khách hàng: ${error.message}`);
    }

    const orders = await Promise.all((data || []).map(async (dh) => {
      const { data: rawItems } = await supabase
        .from('chitietdonhang')
        .select('*')
        .eq('ma_dh', dh.ma_dh);

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
        .eq('ma_dh', dh.ma_dh);

      const extra = await fetchOrderExtraDetails(dh);
      const latestPayment = extra.payments[0] || null;

      return {
        id: dh.ma_dh,
        createdAt: dh.ngay_dat,
        orderStatus: dh.trang_thai,
        paymentStatus: latestPayment ? latestPayment.trang_thai : 'pending',
        total: dh.tong_tien,
        cancelReason: dh.ly_do_huy,
        recipient: dh.nguoi_nhan,
        items,
        codes: (codes || []).map(c => ({
          voucherMuaId: c.ma_voucher_mua,
          voucherId: c.ma_voucher,
          code: c.voucher_code,
          status: c.trang_thai,
          issuedAt: c.thoi_gian_sinh_ma,
          usedAt: c.ngay_su_dung,
          usedBranch: c.chinhanh?.ten_chi_nhanh || null,
        })),
      };
    }));

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

    const latestPayment = extra.payments[0] || null;

    return {
      id: dh.ma_dh,
      createdAt: dh.ngay_dat,
      orderStatus: dh.trang_thai,
      paymentStatus: latestPayment ? latestPayment.trang_thai : 'pending',
      total: dh.tong_tien,
      cancelReason: dh.ly_do_huy,
      recipient: dh.nguoi_nhan,
      items,
      codes: (codes || []).map(c => ({
        voucherMuaId: c.ma_voucher_mua,
        voucherId: c.ma_voucher,
        code: c.voucher_code,
        status: c.trang_thai,
        issuedAt: c.thoi_gian_sinh_ma,
        usedAt: c.ngay_su_dung,
        usedBranch: c.chinhanh?.ten_chi_nhanh || null,
      })),
      payments: extra.payments,
    };
  }

  // -----------------------------------------------------------------------
  // 3. ADMIN: DANH SÁCH ĐƠN HÀNG TOÀN HỆ THỐNG
  // -----------------------------------------------------------------------
  async findAdminOrders({ search, orderStatus, paymentStatus, voucherCodeStatus, page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from('donhang')
      .select('*', { count: 'exact' })
      .order('ngay_dat', { ascending: false })
      .range(offset, offset + limit - 1);

    if (orderStatus) {
      query = query.eq('trang_thai', orderStatus);
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`Lỗi lấy danh sách đơn hàng admin: ${error.message}`);
    }

    let orders = await Promise.all((data || []).map(async (dh) => {
      const extra = await fetchOrderExtraDetails(dh);

      const { data: rawItems } = await supabase
        .from('chitietdonhang')
        .select('*')
        .eq('ma_dh', dh.ma_dh);

      const items = await enrichOrderItems(rawItems);

      const { data: codes } = await supabase
        .from('voucher_mua')
        .select('ma_voucher_mua, voucher_code, trang_thai')
        .eq('ma_dh', dh.ma_dh);

      const latestPayment = extra.payments[0] || null;

      const customerName = extra.customerName;
      const customerEmail = extra.customerEmail;
      const firstItem = items[0] || {};
      const voucherName = firstItem.voucherName || 'Nhiều voucher';
      const partnerName = firstItem.partnerName || 'Đối tác';
      const voucherCodeStatus = codes && codes.length > 0 ? codes[0].trang_thai : 'not_issued';

      return {
        id: dh.ma_dh,
        createdAt: dh.ngay_dat,
        customerName,
        customerEmail,
        voucherName,
        partnerName,
        total: dh.tong_tien,
        orderStatus: dh.trang_thai,
        paymentStatus: latestPayment ? latestPayment.trang_thai : 'pending',
        voucherCodeStatus,
        items,
        codes: (codes || []).map(c => ({
          id: c.ma_voucher_mua,
          code: c.voucher_code,
          status: c.trang_thai,
        })),
      };
    }));

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

    return { orders, total: count || 0 };
  }

  // -----------------------------------------------------------------------
  // 4. ADMIN: CHI TIẾT ĐƠN HÀNG ĐẦY ĐỦ
  // -----------------------------------------------------------------------
  async findAdminOrderById(orderId) {
    const { data: dh, error } = await supabase
      .from('donhang')
      .select('*')
      .eq('ma_dh', orderId)
      .maybeSingle();

    if (error || !dh) return null;

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
    let codeHistory = [];
    if (codeIds.length > 0) {
      const { data: historyData } = await supabase
        .from('lssinhma')
        .select('*')
        .in('ma_voucher_mua', codeIds)
        .order('tg_thuc_hien', { ascending: false });
      codeHistory = historyData || [];
    }

    let complaints = [];
    if (codeIds.length > 0) {
      const { data: compData } = await supabase
        .from('khieunai')
        .select('*')
        .in('ma_voucher_mua', codeIds);
      complaints = compData || [];
    }

    const latestPayment = extra.payments[0] || null;
    const latestRefund = extra.refunds[extra.refunds.length - 1] || null;

    const firstItem = items[0] || {};

    return {
      id: dh.ma_dh,
      createdAt: dh.ngay_dat,
      customerName: extra.customerName,
      customerEmail: extra.customerEmail,
      customerPhone: extra.customerPhone,
      voucherName: firstItem.voucherName || 'Nhiều voucher',
      partnerName: firstItem.partnerName || 'Đối tác',
      total: dh.tong_tien,
      orderStatus: dh.trang_thai,
      paymentStatus: latestPayment ? latestPayment.trang_thai : 'pending',
      voucherCodeStatus: codes && codes.length > 0 ? codes[0].trang_thai : 'not_issued',
      voucherCode: codes && codes.length > 0 ? codes[0].voucher_code : null,
      items,
      codes: (codes || []).map(c => ({
        id: c.ma_voucher_mua,
        voucherId: c.ma_voucher,
        code: c.voucher_code,
        status: c.trang_thai,
        timestamp: c.thoi_gian_sinh_ma,
        usedBranch: c.chinhanh?.ten_chi_nhanh || null,
      })),
      paymentHistory: extra.payments.map(p => ({
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
        action: h.voucher_code_cu ? 'Cấp lại mã mới' : 'Sinh mã lần đầu',
        oldCode: h.voucher_code_cu,
        code: h.voucher_code_moi,
        status: 'issued',
      })),
      refundRequest: latestRefund ? {
        requestedAt: latestRefund.ngay_xu_ly || dh.ngay_dat,
        reason: latestRefund.ly_do || dh.ly_do_huy || 'Yêu cầu từ hệ thống/khách hàng',
        rejectedReason: latestRefund.trang_thai === 'rejected' ? latestRefund.ly_do : null,
      } : (dh.ly_do_huy ? { requestedAt: dh.ngay_dat, reason: dh.ly_do_huy } : null),
      complaints: complaints.map(k => ({
        id: k.ma_khieu_nai,
        content: k.noi_dung,
        status: k.trang_thai,
        createdAt: k.ngay_khieu_nai,
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
        trang_thai: 'new',
        ma_voucher_mua: maVoucherMua,
        ma_tk_xuly: null,
      })
      .select()
      .single();

    if (error) throw new Error(`Lỗi gửi khiếu nại: ${error.message}`);
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

    if (error) throw new Error(`Lỗi gửi đánh giá: ${error.message}`);
    return data;
  }

  // -----------------------------------------------------------------------
  // 6. XỬ LÝ NGHIỆP VỤ ADMIN: A4a, A4b, A4c, A4d
  // -----------------------------------------------------------------------
  async updatePaymentStatusAndGenerateCodes(maDh, newStatus, reason, maTkAdmin) {
    const { data: dh } = await supabase.from('donhang').select('tong_tien').eq('ma_dh', maDh).single();
    if (!dh) throw new Error('Không tìm thấy đơn hàng');

    const { data: payRecord, error: payError } = await supabase
      .from('thanhtoan')
      .insert({
        so_tien: dh.tong_tien,
        phuong_thuc_tt: 'manual_admin',
        trang_thai: newStatus,
        ma_dh: maDh,
      })
      .select()
      .single();

    if (payError) throw payError;

    const orderStatus = newStatus === 'success' ? 'Da thanh toan' : 'Cho thanh toan';
    await supabase.from('donhang').update({ trang_thai: orderStatus }).eq('ma_dh', maDh);

    if (newStatus === 'success') {
      const { data: items } = await supabase.from('chitietdonhang').select('*').eq('ma_dh', maDh);
      for (const item of (items || [])) {
        for (let i = 0; i < item.so_luong; i++) {
          const randomCode = `EC26-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          await supabase.from('voucher_mua').insert({
            ma_dh: maDh,
            ma_voucher: item.ma_voucher,
            voucher_code: randomCode,
            trang_thai: 'issued',
          });
        }
      }
    }

    return payRecord;
  }

  async cancelOrder(maDh, reason) {
    const { data, error } = await supabase
      .from('donhang')
      .update({ trang_thai: 'Cho hoan tien', ly_do_huy: reason })
      .eq('ma_dh', maDh)
      .select()
      .single();

    if (error) throw new Error(`Lỗi hủy đơn hàng: ${error.message}`);
    return data;
  }

  async confirmRefund(maDh, reason, maTkAdmin) {
    await supabase.from('donhang').update({ trang_thai: 'Da hoan tien', ly_do_huy: reason }).eq('ma_dh', maDh);
    await supabase.from('voucher_mua').update({ trang_thai: 'disabled' }).eq('ma_dh', maDh);

    const { data: pays } = await supabase.from('thanhtoan').select('*').eq('ma_dh', maDh).eq('trang_thai', 'success').order('thoi_gian_tt', { ascending: false }).limit(1);
    const latestPay = pays && pays[0] ? pays[0] : null;

    if (latestPay) {
      await supabase.from('hoantien').insert({
        so_tien: latestPay.so_tien,
        trang_thai: 'completed',
        ly_do: reason,
        ngay_xu_ly: new Date().toISOString(),
        ma_tk: maTkAdmin,
        ma_thanh_toan: latestPay.ma_thanh_toan,
      });
      await supabase.from('thanhtoan').update({ trang_thai: 'refunded_sim' }).eq('ma_thanh_toan', latestPay.ma_thanh_toan);
    }

    return { success: true };
  }

  async rejectRefund(maDh, reason, maTkAdmin) {
    await supabase.from('donhang').update({ trang_thai: 'Huy yeu cau hoan tien', ly_do_huy: reason }).eq('ma_dh', maDh);
    const { data: pays } = await supabase.from('thanhtoan').select('*').eq('ma_dh', maDh).order('thoi_gian_tt', { ascending: false }).limit(1);
    const latestPay = pays && pays[0] ? pays[0] : null;

    if (latestPay) {
      await supabase.from('hoantien').insert({
        so_tien: latestPay.so_tien,
        trang_thai: 'rejected',
        ly_do: reason,
        ngay_xu_ly: new Date().toISOString(),
        ma_tk: maTkAdmin,
        ma_thanh_toan: latestPay.ma_thanh_toan,
      });
    }

    return { success: true };
  }

  async reissueVoucherCode(maVoucherMua, maTkAdmin) {
    const { data: oldVm, error: errVm } = await supabase
      .from('voucher_mua')
      .select('*')
      .eq('ma_voucher_mua', maVoucherMua)
      .single();

    if (errVm || !oldVm) throw new Error('Không tìm thấy mã voucher cần cấp lại');

    await supabase.from('voucher_mua').update({ trang_thai: 'disabled' }).eq('ma_voucher_mua', maVoucherMua);

    const newCode = `NEW-${Math.random().toString(36).substring(2, 8).toUpperCase()}` ;
    const { data: newVm, error: errNew } = await supabase
      .from('voucher_mua')
      .insert({
        ma_dh: oldVm.ma_dh,
        ma_voucher: oldVm.ma_voucher,
        voucher_code: newCode,
        trang_thai: 'issued',
      })
      .select()
      .single();

    if (errNew) throw new Error(`Lỗi sinh mã mới: ${errNew.message}`);

    await supabase.from('lssinhma').insert({
      voucher_code_cu: oldVm.voucher_code,
      voucher_code_moi: newCode,
      tg_thuc_hien: new Date().toISOString(),
      ma_voucher_mua: newVm.ma_voucher_mua,
      ma_tk_admin: maTkAdmin,
    });

    return newVm;
  }
}

module.exports = new OrderRepository();
