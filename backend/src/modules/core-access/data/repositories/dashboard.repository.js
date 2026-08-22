/**
 * FILE: backend/src/modules/core-access/data/repositories/dashboard.repository.js
 * PURPOSE: Truy vấn các chỉ số tổng quan, biểu đồ doanh thu, phân bổ đối tác và hàng đợi công việc cần xử lý (BR_ADM_06).
 */
const supabase = require('../../../../config/supabase');

class DashboardRepository {
  /**
   * Tổng người dùng trong bảng nguoidung
   */
  async countUsers() {
    try {
      const { count, error } = await supabase
        .from('nguoidung')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[DashboardRepository] countUsers error:', err.message);
      return 0;
    }
  }

  /**
   * Đối tác đang hoạt động
   */
  async countActivePartners() {
    try {
      const { count, error } = await supabase
        .from('hosodn')
        .select('*', { count: 'exact', head: true })
        .in('trang_thai', ['Dang hoat dong', 'Hoat dong']);
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[DashboardRepository] countActivePartners error:', err.message);
      return 0;
    }
  }

  /**
   * Đối tác chờ duyệt
   */
  async countPendingPartners() {
    try {
      const { count, error } = await supabase
        .from('hosodn')
        .select('*', { count: 'exact', head: true })
        .eq('trang_thai', 'Cho duyet');
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[DashboardRepository] countPendingPartners error:', err.message);
      return 0;
    }
  }

  /**
   * Voucher đang bán (Dang ban)
   */
  async countActiveVouchers() {
    try {
      const { count, error } = await supabase
        .from('voucher')
        .select('*', { count: 'exact', head: true })
        .eq('trang_thai', 'Dang ban');
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[DashboardRepository] countActiveVouchers error:', err.message);
      return 0;
    }
  }

  /**
   * Voucher chờ duyệt (Cho duyet)
   */
  async countPendingVouchers() {
    try {
      const { count, error } = await supabase
        .from('voucher')
        .select('*', { count: 'exact', head: true })
        .eq('trang_thai', 'Cho duyet');
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[DashboardRepository] countPendingVouchers error:', err.message);
      return 0;
    }
  }

  /**
   * Đơn hàng chờ xử lý (hoàn tiền, yêu cầu hủy hoặc lỗi sinh voucher code)
   */
  async countPendingOrders() {
    try {
      const [refunds, failedCodes, cancelRequests] = await Promise.all([
        supabase.from('donhang').select('ma_dh').eq('trang_thai', 'Cho hoan tien'),
        supabase.from('voucher_mua').select('ma_dh').eq('trang_thai', 'Loi sinh ma'),
        supabase.from('yeucauhuy').select('ma_dh').eq('trang_thai', 'Cho xu ly'),
      ]);
      if (refunds.error) throw refunds.error;
      if (failedCodes.error) throw failedCodes.error;
      if (cancelRequests.error) throw cancelRequests.error;
      return new Set([
        ...(refunds.data || []).map((item) => item.ma_dh),
        ...(failedCodes.data || []).map((item) => item.ma_dh),
        ...(cancelRequests.data || []).map((item) => item.ma_dh),
      ]).size;
    } catch (err) {
      console.warn('[DashboardRepository] countPendingOrders error:', err.message);
      return 0;
    }
  }

  /**
   * Đơn hàng đang khiếu nại (Đếm số đơn hàng có khiếu nại ở trạng thái Moi, Dang xu ly)
   */
  async countComplaintOrders() {
    try {
      const { data: complaints, error: complaintError } = await supabase
        .from('khieunai')
        .select('ma_voucher_mua')
        .in('trang_thai', ['Moi', 'Dang xu ly']);

      if (complaintError) throw complaintError;
      const purchasedVoucherIds = [...new Set((complaints || []).map(item => item.ma_voucher_mua).filter(Boolean))];
      if (purchasedVoucherIds.length === 0) return 0;

      const { data: purchasedVouchers, error: purchasedVoucherError } = await supabase
        .from('voucher_mua')
        .select('ma_voucher_mua, ma_dh')
        .in('ma_voucher_mua', purchasedVoucherIds);
      if (purchasedVoucherError) throw purchasedVoucherError;

      const distinctOrders = new Set((purchasedVouchers || []).map(item => item.ma_dh).filter(Boolean));
      return distinctOrders.size;
    } catch (err) {
      console.warn('[DashboardRepository] countComplaintOrders error:', err.message);
      return 0;
    }
  }

  /**
   * Lấy lịch sử doanh thu và tổng hợp timeline theo ngày / tháng / năm
   */
  async getRevenueTimeline() {
    try {
      const { data, error } = await supabase
        .from('thanhtoan')
        .select('so_tien, thoi_gian_tt, donhang!inner(trang_thai)')
        .eq('trang_thai', 'Thanh cong')
        .in('donhang.trang_thai', ['Da thanh toan', 'Cho hoan tien'])
        .order('thoi_gian_tt', { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        return { totalRevenue: 0, daily: [], monthly: [], yearly: [] };
      }

      let total = 0;
      const dailyMap = new Map();
      const monthlyMap = new Map();
      const yearlyMap = new Map();

      for (const row of data) {
        const amount = Number(row.so_tien) || 0;
        total += amount;
        if (!row.thoi_gian_tt) continue;
        const d = new Date(row.thoi_gian_tt);

        // Daily: YYYY-MM-DD
        const dayKey = d.toISOString().slice(0, 10);
        const dayLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
        const dayFullLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
        const curDay = dailyMap.get(dayKey) || { date: dayKey, label: dayLabel, fullLabel: dayFullLabel, revenue: 0, count: 0 };
        curDay.revenue += amount;
        curDay.count += 1;
        dailyMap.set(dayKey, curDay);

        // Monthly: YYYY-MM
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = `T${d.getMonth() + 1}/${d.getFullYear()}`;
        const monthFullLabel = `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
        const curMonth = monthlyMap.get(monthKey) || { date: monthKey, label: monthLabel, fullLabel: monthFullLabel, revenue: 0, count: 0 };
        curMonth.revenue += amount;
        curMonth.count += 1;
        monthlyMap.set(monthKey, curMonth);

        // Yearly: YYYY
        const yearKey = String(d.getFullYear());
        const yearLabel = `${yearKey}`;
        const yearFullLabel = `Năm ${yearKey}`;
        const curYear = yearlyMap.get(yearKey) || { date: yearKey, label: yearLabel, fullLabel: yearFullLabel, revenue: 0, count: 0 };
        curYear.revenue += amount;
        curYear.count += 1;
        yearlyMap.set(yearKey, curYear);
      }

      const sortedDailyKeys = Array.from(dailyMap.keys()).sort();
      let daily = [];
      if (sortedDailyKeys.length > 0) {
        const minDate = new Date(sortedDailyKeys[0]);
        const maxDate = new Date(sortedDailyKeys[sortedDailyKeys.length - 1]);
        const curr = new Date(minDate);
        while (curr <= maxDate) {
          const dayKey = curr.toISOString().slice(0, 10);
          const dayLabel = `${String(curr.getDate()).padStart(2, '0')}/${String(curr.getMonth() + 1).padStart(2, '0')}`;
          const dayFullLabel = `${String(curr.getDate()).padStart(2, '0')}/${String(curr.getMonth() + 1).padStart(2, '0')}/${curr.getFullYear()}`;
          if (dailyMap.has(dayKey)) {
            daily.push(dailyMap.get(dayKey));
          } else {
            daily.push({ date: dayKey, label: dayLabel, fullLabel: dayFullLabel, revenue: 0, count: 0 });
          }
          curr.setDate(curr.getDate() + 1);
        }
      }

      const monthly = Array.from(monthlyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
      const yearly = Array.from(yearlyMap.values()).sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalRevenue: total,
        daily,
        monthly,
        yearly,
      };
    } catch (err) {
      console.warn('[DashboardRepository] getRevenueTimeline error:', err.message);
      return { totalRevenue: 0, daily: [], monthly: [], yearly: [] };
    }
  }

  /**
   * Phân bố trạng thái đối tác cho Biểu đồ cột nằm ngang
   */
  async getPartnerStatusDistribution() {
    try {
      const { data, error } = await supabase
        .from('hosodn')
        .select('trang_thai');
      if (error) throw error;

      const counts = {
        'Dang hoat dong': 0,
        'Cho duyet': 0,
        'Tam khoa': 0,
        'Tu choi': 0,
      };

      (data || []).forEach((r) => {
        const st = r.trang_thai;
        if (st === 'Dang hoat dong' || st === 'Hoat dong') {
          counts['Dang hoat dong'] += 1;
        } else if (counts[st] !== undefined) {
          counts[st] += 1;
        } else {
          counts[st] = (counts[st] || 0) + 1;
        }
      });

      const total = Object.values(counts).reduce((a, b) => a + b, 0);

      const items = [
        { status: 'Dang hoat dong', label: 'Đang hoạt động', count: counts['Dang hoat dong'] || 0, fill: '#10b981', colorName: 'emerald' },
        { status: 'Cho duyet', label: 'Chờ xét duyệt', count: counts['Cho duyet'] || 0, fill: '#f59e0b', colorName: 'amber' },
        { status: 'Tam khoa', label: 'Tạm khóa', count: counts['Tam khoa'] || 0, fill: '#ef4444', colorName: 'rose' },
        { status: 'Tu choi', label: 'Từ chối', count: counts['Tu choi'] || 0, fill: '#64748b', colorName: 'slate' },
      ];

      return {
        total,
        items,
      };
    } catch (err) {
      console.warn('[DashboardRepository] getPartnerStatusDistribution error:', err.message);
      return { total: 0, items: [] };
    }
  }

  /**
   * Danh sách các mục công việc cần xử lý (Hàng đợi chờ duyệt / chờ xử lý)
   */
  async getPendingWorkQueue() {
    const emptyQueue = {
      totalPending: 0,
      partnerManagement: {
        counts: { pendingPartners: 0, branchChangeRequests: 0, profileChangeRequests: 0, pendingVouchers: 0 },
        pendingPartners: [],
        branchChangeRequests: [],
        profileChangeRequests: [],
        pendingVouchers: [],
      },
      customerRequests: {
        counts: { cancelRequests: 0, complaints: 0, refundOrders: 0, failedGenOrders: 0 },
        cancelRequests: [],
        complaints: [],
        refundOrders: [],
        failedGenOrders: [],
      },
    };

    try {
      const results = await Promise.allSettled([
        supabase.from('hosodn')
          .select('ma_hs, ten_dn, ngay_tao, trang_thai', { count: 'exact' })
          .eq('trang_thai', 'Cho duyet')
          .order('ngay_tao', { ascending: false })
          .limit(5),
        supabase.from('yeu_cau_cap_nhat_chinhanh')
          .select('ma_yc, ma_chi_nhanh, loai_yeu_cau, ten_chi_nhanh_moi, ngay_yeu_cau, trang_thai', { count: 'exact' })
          .eq('trang_thai', 'Cho duyet')
          .order('ngay_yeu_cau', { ascending: false })
          .limit(5),
        supabase.from('yeu_cau_cap_nhat_hosodn')
          .select('ma_yc, ma_hs, ten_dn_moi, ngay_yeu_cau, trang_thai', { count: 'exact' })
          .eq('trang_thai', 'Cho duyet')
          .order('ngay_yeu_cau', { ascending: false })
          .limit(5),
        supabase.from('voucher')
          .select('ma_voucher, ten_voucher, tg_bat_dau_ban, trang_thai', { count: 'exact' })
          .eq('trang_thai', 'Cho duyet')
          .order('tg_bat_dau_ban', { ascending: false })
          .limit(5),
        supabase.from('yeucauhuy')
          .select('ma_yc_huy, ma_dh, ly_do_kh, ngay_yeu_cau, trang_thai', { count: 'exact' })
          .eq('trang_thai', 'Cho xu ly')
          .order('ngay_yeu_cau', { ascending: false })
          .limit(5),
        supabase.from('khieunai')
          .select('ma_khieu_nai, ma_voucher_mua, noi_dung, ngay_khieu_nai, trang_thai', { count: 'exact' })
          .in('trang_thai', ['Moi', 'Dang xu ly'])
          .order('ngay_khieu_nai', { ascending: false })
          .limit(5),
        supabase.from('donhang')
          .select('ma_dh, ngay_dat, nguoi_nhan, tong_tien, trang_thai', { count: 'exact' })
          .eq('trang_thai', 'Cho hoan tien')
          .order('ngay_dat', { ascending: false })
          .limit(5),
        supabase.from('voucher_mua')
          .select('ma_voucher_mua, ma_dh, ma_voucher, trang_thai, thoi_gian_sinh_ma', { count: 'exact' })
          .eq('trang_thai', 'Loi sinh ma')
          .order('thoi_gian_sinh_ma', { ascending: false })
          .limit(5),
      ]);

      const labels = [
        'đối tác chờ duyệt',
        'yêu cầu thay đổi chi nhánh',
        'yêu cầu thay đổi hồ sơ',
        'voucher chờ duyệt',
        'yêu cầu hủy đơn',
        'khiếu nại',
        'đơn chờ hoàn tiền',
        'lỗi sinh mã',
      ];
      const readResult = (result, index) => {
        if (result.status === 'rejected') {
          console.warn(`[DashboardRepository] Không tải được ${labels[index]}:`, result.reason?.message || result.reason);
          return { data: [], count: 0 };
        }
        if (result.value.error) {
          console.warn(`[DashboardRepository] Không tải được ${labels[index]}:`, result.value.error.message);
          return { data: [], count: 0 };
        }
        return { data: result.value.data || [], count: result.value.count || 0 };
      };
      const orderCode = (id) => id ? `#${String(id).slice(0, 8).toUpperCase()}` : '—';

      const [partners, branchChanges, profileChanges, vouchers, cancellations, complaints, refunds, failedCodes]
        = results.map(readResult);

      const loadRowsByIds = async (table, columns, key, ids, label) => {
        const uniqueIds = [...new Set(ids.filter(Boolean))];
        if (uniqueIds.length === 0) return [];
        const { data, error } = await supabase.from(table).select(columns).in(key, uniqueIds);
        if (error) {
          console.warn(`[DashboardRepository] Không tải được ${label}:`, error.message);
          return [];
        }
        return data || [];
      };

      const [branchRows, complaintPurchasedVouchers] = await Promise.all([
        loadRowsByIds(
          'chinhanh',
          'ma_chi_nhanh, ma_hs, ten_chi_nhanh',
          'ma_chi_nhanh',
          branchChanges.data.map(item => item.ma_chi_nhanh),
          'chi nhánh của yêu cầu thay đổi',
        ),
        loadRowsByIds(
          'voucher_mua',
          'ma_voucher_mua, ma_dh, ma_voucher',
          'ma_voucher_mua',
          complaints.data.map(item => item.ma_voucher_mua),
          'voucher mua của khiếu nại',
        ),
      ]);

      const complaintPurchasedById = new Map(
        complaintPurchasedVouchers.map(item => [item.ma_voucher_mua, item]),
      );
      const orderIds = [
        ...cancellations.data.map(item => item.ma_dh),
        ...complaintPurchasedVouchers.map(item => item.ma_dh),
        ...refunds.data.map(item => item.ma_dh),
        ...failedCodes.data.map(item => item.ma_dh),
      ];
      const complaintVoucherIds = complaintPurchasedVouchers.map(item => item.ma_voucher);
      const [orderRows, complaintVoucherRows] = await Promise.all([
        loadRowsByIds(
          'donhang',
          'ma_dh, ngay_dat, nguoi_nhan, tong_tien, trang_thai',
          'ma_dh',
          orderIds,
          'đơn hàng liên quan',
        ),
        loadRowsByIds(
          'voucher',
          'ma_voucher, ten_voucher',
          'ma_voucher',
          complaintVoucherIds,
          'voucher của khiếu nại',
        ),
      ]);
      const branchById = new Map(branchRows.map(item => [item.ma_chi_nhanh, item]));
      const orderById = new Map(orderRows.map(item => [item.ma_dh, item]));
      const voucherById = new Map(complaintVoucherRows.map(item => [item.ma_voucher, item]));

      const partnerManagement = {
        counts: {
          pendingPartners: partners.count,
          branchChangeRequests: branchChanges.count,
          profileChangeRequests: profileChanges.count,
          pendingVouchers: vouchers.count,
        },
        pendingPartners: partners.data.map((item) => ({
          id: item.ma_hs,
          partnerId: item.ma_hs,
          name: item.ten_dn || 'Đối tác chưa đặt tên',
          date: item.ngay_tao,
          status: item.trang_thai,
        })),
        branchChangeRequests: branchChanges.data.map((item) => {
          const branch = branchById.get(item.ma_chi_nhanh) || {};
          return {
            id: item.ma_yc,
            partnerId: branch.ma_hs,
            name: item.ten_chi_nhanh_moi || branch.ten_chi_nhanh || `Chi nhánh ${String(item.ma_chi_nhanh || '').slice(0, 8)}`,
            description: item.loai_yeu_cau === 'THEM_MOI' ? 'Thêm chi nhánh' : item.loai_yeu_cau === 'XOA' ? 'Xóa chi nhánh' : 'Cập nhật chi nhánh',
            date: item.ngay_yeu_cau,
            status: item.trang_thai,
          };
        }),
        profileChangeRequests: profileChanges.data.map((item) => ({
          id: item.ma_yc,
          partnerId: item.ma_hs,
          name: item.ten_dn_moi || `Hồ sơ doanh nghiệp ${String(item.ma_hs || '').slice(0, 8)}`,
          description: 'Cập nhật hồ sơ doanh nghiệp',
          date: item.ngay_yeu_cau,
          status: item.trang_thai,
        })),
        pendingVouchers: vouchers.data.map((item) => ({
          id: item.ma_voucher,
          name: item.ten_voucher || 'Voucher chưa đặt tên',
          date: item.tg_bat_dau_ban,
          status: item.trang_thai,
        })),
      };

      const customerRequests = {
        counts: {
          cancelRequests: cancellations.count,
          complaints: complaints.count,
          refundOrders: refunds.count,
          failedGenOrders: failedCodes.count,
        },
        cancelRequests: cancellations.data.map((item) => {
          const order = orderById.get(item.ma_dh) || {};
          return {
            id: item.ma_yc_huy,
            orderId: item.ma_dh,
            name: `${orderCode(item.ma_dh)} · ${order.nguoi_nhan || 'Khách hàng'}`,
            description: item.ly_do_kh,
            date: item.ngay_yeu_cau,
            amount: order.tong_tien || 0,
            status: item.trang_thai,
          };
        }),
        complaints: complaints.data.map((item) => {
          const purchasedVoucher = complaintPurchasedById.get(item.ma_voucher_mua) || {};
          const order = orderById.get(purchasedVoucher.ma_dh) || {};
          const voucher = voucherById.get(purchasedVoucher.ma_voucher) || {};
          return {
            id: item.ma_khieu_nai,
            orderId: purchasedVoucher.ma_dh,
            name: `${orderCode(purchasedVoucher.ma_dh)} · ${order.nguoi_nhan || 'Khách hàng'}`,
            description: `${voucher.ten_voucher ? `${voucher.ten_voucher}: ` : ''}${item.noi_dung}`,
            date: item.ngay_khieu_nai,
            amount: order.tong_tien || 0,
            status: item.trang_thai,
          };
        }),
        refundOrders: refunds.data.map((item) => ({
          id: item.ma_dh,
          orderId: item.ma_dh,
          name: `${orderCode(item.ma_dh)} · ${item.nguoi_nhan || 'Khách hàng'}`,
          description: 'Đơn hàng đang chờ thực hiện hoàn tiền',
          date: item.ngay_dat,
          amount: item.tong_tien || 0,
          status: item.trang_thai,
        })),
        failedGenOrders: failedCodes.data.map((item) => {
          const order = orderById.get(item.ma_dh) || {};
          return {
            id: item.ma_voucher_mua,
            orderId: order.ma_dh,
            name: `${orderCode(order.ma_dh)} · ${order.nguoi_nhan || 'Khách hàng'}`,
            description: 'Voucher code phát hành bị lỗi',
            date: item.thoi_gian_sinh_ma || order.ngay_dat,
            amount: order.tong_tien || 0,
            status: item.trang_thai,
          };
        }),
      };

      return {
        totalPending: partners.count + branchChanges.count + profileChanges.count + vouchers.count
          + cancellations.count + complaints.count + refunds.count + failedCodes.count,
        partnerManagement,
        customerRequests,
      };
    } catch (err) {
      console.warn('[DashboardRepository] getPendingWorkQueue error:', err.message);
      return emptyQueue;
    }
  }

  /**
   * Lấy tất cả chỉ số cùng lúc (Promise.allSettled để tránh một lỗi làm hỏng toàn bộ)
   */
  async getAllMetrics() {
    const [
      usersResult,
      activePartnersResult,
      pendingPartnersResult,
      activeVouchersResult,
      pendingVouchersResult,
      pendingOrdersResult,
      complaintOrdersResult,
      revenueResult,
      partnerDistributionResult,
      workQueueResult,
    ] = await Promise.allSettled([
      this.countUsers(),
      this.countActivePartners(),
      this.countPendingPartners(),
      this.countActiveVouchers(),
      this.countPendingVouchers(),
      this.countPendingOrders(),
      this.countComplaintOrders(),
      this.getRevenueTimeline(),
      this.getPartnerStatusDistribution(),
      this.getPendingWorkQueue(),
    ]);

    const rev = revenueResult.status === 'fulfilled' ? revenueResult.value : { totalRevenue: 0, daily: [], monthly: [], yearly: [] };
    const partnerDist = partnerDistributionResult.status === 'fulfilled' ? partnerDistributionResult.value : { total: 0, items: [] };
    const workQueue = workQueueResult.status === 'fulfilled' ? workQueueResult.value : {
      totalPending: 0,
      partnerManagement: {
        counts: { pendingPartners: 0, branchChangeRequests: 0, profileChangeRequests: 0, pendingVouchers: 0 },
        pendingPartners: [], branchChangeRequests: [], profileChangeRequests: [], pendingVouchers: [],
      },
      customerRequests: {
        counts: { cancelRequests: 0, complaints: 0, refundOrders: 0, failedGenOrders: 0 },
        cancelRequests: [], complaints: [], refundOrders: [], failedGenOrders: [],
      },
    };

    return {
      totalUsers: usersResult.status === 'fulfilled' ? usersResult.value : null,
      activePartners: activePartnersResult.status === 'fulfilled' ? activePartnersResult.value : null,
      pendingPartners: pendingPartnersResult.status === 'fulfilled' ? pendingPartnersResult.value : null,
      activeVouchers: activeVouchersResult.status === 'fulfilled' ? activeVouchersResult.value : null,
      pendingVouchers: pendingVouchersResult.status === 'fulfilled' ? pendingVouchersResult.value : null,
      pendingOrders: pendingOrdersResult.status === 'fulfilled' ? pendingOrdersResult.value : null,
      complaintOrders: complaintOrdersResult.status === 'fulfilled' ? complaintOrdersResult.value : null,
      totalRevenue: rev.totalRevenue,
      revenueTimeline: {
        daily: rev.daily || [],
        monthly: rev.monthly || [],
        yearly: rev.yearly || [],
      },
      partnerDistribution: partnerDist,
      workQueue: workQueue,
    };
  }
}

module.exports = new DashboardRepository();
