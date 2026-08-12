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
   * Đơn hàng chờ xử lí (Cho hoan tien, Loi sinh ma, Loi thanh toan)
   */
  async countPendingOrders() {
    try {
      const { count, error } = await supabase
        .from('donhang')
        .select('*', { count: 'exact', head: true })
        .in('trang_thai', ['Cho hoan tien', 'Loi sinh ma', 'Loi thanh toan']);
      if (error) throw error;
      return count || 0;
    } catch (err) {
      console.warn('[DashboardRepository] countPendingOrders error:', err.message);
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
        .select('so_tien, thoi_gian_tt')
        .eq('trang_thai', 'Thanh cong')
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
    try {
      const [
        partnersRes,
        branchesRes,
        vouchersRes,
        refundsRes,
        failedGenRes,
      ] = await Promise.allSettled([
        supabase.from('hosodn').select('ma_hs, ten_dn, ngay_tao, trang_thai').eq('trang_thai', 'Cho duyet').order('ngay_tao', { ascending: false }).limit(5),
        supabase.from('chinhanh').select('ma_chi_nhanh, ten_chi_nhanh, trang_thai, ma_hs').eq('trang_thai', 'Cho duyet').limit(5),
        supabase.from('voucher').select('ma_voucher, ten_voucher, tg_bat_dau_ban, trang_thai').eq('trang_thai', 'Cho duyet').order('tg_bat_dau_ban', { ascending: false }).limit(5),
        supabase.from('donhang').select('ma_dh, ngay_dat, nguoi_nhan, tong_tien, trang_thai').eq('trang_thai', 'Cho hoan tien').order('ngay_dat', { ascending: false }).limit(5),
        supabase.from('donhang').select('ma_dh, ngay_dat, nguoi_nhan, tong_tien, trang_thai').eq('trang_thai', 'Loi sinh ma').order('ngay_dat', { ascending: false }).limit(5),
      ]);

      const pendingPartners = partnersRes.status === 'fulfilled' && partnersRes.value.data ? partnersRes.value.data.map(p => ({
        id: p.ma_hs,
        name: p.ten_dn || 'Đối tác chưa đặt tên',
        date: p.ngay_tao,
        type: 'partner',
        status: p.trang_thai,
      })) : [];

      const pendingBranches = branchesRes.status === 'fulfilled' && branchesRes.value.data ? branchesRes.value.data.map(b => ({
        id: b.ma_chi_nhanh,
        name: b.ten_chi_nhanh || 'Chi nhánh mới',
        partnerId: b.ma_hs,
        type: 'branch',
        status: b.trang_thai,
      })) : [];

      const pendingVouchers = vouchersRes.status === 'fulfilled' && vouchersRes.value.data ? vouchersRes.value.data.map(v => ({
        id: v.ma_voucher,
        name: v.ten_voucher || 'Voucher chưa đặt tên',
        date: v.tg_bat_dau_ban,
        type: 'voucher',
        status: v.trang_thai,
      })) : [];

      const refundOrders = refundsRes.status === 'fulfilled' && refundsRes.value.data ? refundsRes.value.data.map(d => ({
        id: d.ma_dh,
        orderCode: `ORD${String(d.ma_dh).slice(0, 4).toUpperCase()}`,
        customerName: d.nguoi_nhan || 'Khách hàng',
        date: d.ngay_dat,
        amount: d.tong_tien,
        type: 'refund_order',
        status: d.trang_thai,
      })) : [];

      const failedGenOrders = failedGenRes.status === 'fulfilled' && failedGenRes.value.data ? failedGenRes.value.data.map(d => ({
        id: d.ma_dh,
        orderCode: `ORD${String(d.ma_dh).slice(0, 4).toUpperCase()}`,
        customerName: d.nguoi_nhan || 'Khách hàng',
        date: d.ngay_dat,
        amount: d.tong_tien,
        type: 'failed_gen_order',
        status: d.trang_thai,
      })) : [];

      const totalPending = pendingPartners.length + pendingBranches.length + pendingVouchers.length + refundOrders.length + failedGenOrders.length;

      return {
        totalPending,
        pendingPartners,
        pendingBranches,
        pendingVouchers,
        refundOrders,
        failedGenOrders,
      };
    } catch (err) {
      console.warn('[DashboardRepository] getPendingWorkQueue error:', err.message);
      return {
        totalPending: 0,
        pendingPartners: [],
        pendingBranches: [],
        pendingVouchers: [],
        refundOrders: [],
        failedGenOrders: [],
      };
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
      this.getRevenueTimeline(),
      this.getPartnerStatusDistribution(),
      this.getPendingWorkQueue(),
    ]);

    const rev = revenueResult.status === 'fulfilled' ? revenueResult.value : { totalRevenue: 0, daily: [], monthly: [], yearly: [] };
    const partnerDist = partnerDistributionResult.status === 'fulfilled' ? partnerDistributionResult.value : { total: 0, items: [] };
    const workQueue = workQueueResult.status === 'fulfilled' ? workQueueResult.value : { totalPending: 0, pendingPartners: [], pendingBranches: [], pendingVouchers: [], refundOrders: [], failedGenOrders: [] };

    return {
      totalUsers: usersResult.status === 'fulfilled' ? usersResult.value : null,
      activePartners: activePartnersResult.status === 'fulfilled' ? activePartnersResult.value : null,
      pendingPartners: pendingPartnersResult.status === 'fulfilled' ? pendingPartnersResult.value : null,
      activeVouchers: activeVouchersResult.status === 'fulfilled' ? activeVouchersResult.value : null,
      pendingVouchers: pendingVouchersResult.status === 'fulfilled' ? pendingVouchersResult.value : null,
      pendingOrders: pendingOrdersResult.status === 'fulfilled' ? pendingOrdersResult.value : null,
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
