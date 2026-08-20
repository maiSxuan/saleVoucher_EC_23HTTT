/**
 * Purpose: Service cung cấp dữ liệu báo cáo thực tế cho partner từ Supabase DB (BR_PAR_06).
 */
const voucherRepository = require("../../data/repositories/voucher.repository");
const supabase = require("../../../../config/supabase");
const translationService = require("../../../../common/services/translation.service");

class PartnerReportService {
  async getReport(query = {}) {
    const partnerId = query.partnerId || query.ma_hs;
    const voucherId = query.voucherId || "all";
    const startDate = query.startDate;
    const endDate = query.endDate;

    if (!partnerId) {
      return {
        vouchers: [],
        filteredData: [],
        revenueTrend: [],
        totalIssued: 0,
        totalSold: 0,
        totalUsed: 0,
        totalRevenue: 0,
        usageRate: 0,
        emptyReason: "no_vouchers",
      };
    }

    const allVouchers = await voucherRepository.findByPartnerId(partnerId);
    if (!allVouchers || allVouchers.length === 0) {
      return {
        vouchers: [],
        filteredData: [],
        revenueTrend: [],
        totalIssued: 0,
        totalSold: 0,
        totalUsed: 0,
        totalRevenue: 0,
        usageRate: 0,
        emptyReason: "no_vouchers",
      };
    }

    // Only include official published/approved vouchers in sales/issuance reports
    const publishedVouchers = allVouchers.filter((v) => {
      // Exclude unapproved / draft / rejected vouchers from sales reports
      if (v.trang_thai === "Cho duyet" || v.trang_thai === "Nhap" || v.trang_thai === "Tu choi") {
        return false;
      }
      return true;
    });

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 86400000);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // Filter by voucherId selection and date range overlap
    const filtered = publishedVouchers.filter((v) => {
      if (voucherId && voucherId !== "all" && v.ma_voucher !== voucherId) {
        return false;
      }

      const vStart = v.tg_bat_dau_ban
        ? new Date(v.tg_bat_dau_ban)
        : v.ngay_tao
        ? new Date(v.ngay_tao)
        : new Date(0);
      const vEnd = v.tg_ket_thuc_ban
        ? new Date(v.tg_ket_thuc_ban)
        : new Date(Date.now() + 365 * 86400000);

      return vStart <= end && vEnd >= start;
    });

    const dropdownList = publishedVouchers.map((v) => ({
      ma_voucher: v.ma_voucher,
      ten_voucher: v.ten_voucher,
    }));

    // Query voucher_mua records to get exact date-filtered sales & usage counts
    const voucherIds = filtered.map((v) => v.ma_voucher);
    let voucherMuaList = [];

    if (voucherIds.length > 0) {
      try {
        const { data: vMua, error: vErr } = await supabase
          .from("voucher_mua")
          .select("ma_voucher_mua, ma_voucher, trang_thai, thoi_gian_sinh_ma, ngay_su_dung")
          .in("ma_voucher", voucherIds);

        if (!vErr && vMua) {
          voucherMuaList = vMua;
        }
      } catch (e) {
        console.warn("[PartnerReportService] voucher_mua query warning:", e.message);
      }
    }

    const breakdown = filtered.map((v) => {
      const issued = Number(v.so_luong_phat_hanh) || 0;
      const giaBan = Number(v.gia_ban) || (Number(v.gia_goc) - Number(v.gia_tri_giam || 0)) || 0;

      // Filter voucher_mua items for this specific voucher within date range [start, end]
      const vMuaItems = voucherMuaList.filter((m) => m.ma_voucher === v.ma_voucher);

      let sold = 0;
      let used = 0;

      if (vMuaItems.length > 0) {
        vMuaItems.forEach((m) => {
          const buyDateStr = m.thoi_gian_sinh_ma || m.ngay_su_dung;
          const buyDate = buyDateStr ? new Date(buyDateStr) : null;
          if (buyDate && !isNaN(buyDate.getTime()) && buyDate.getTime() >= start.getTime() && buyDate.getTime() <= end.getTime()) {
            sold += 1;
          }

          const useDateStr = m.ngay_su_dung || m.thoi_gian_sinh_ma;
          const useDate = useDateStr ? new Date(useDateStr) : buyDate;
          if (m.trang_thai === "Da su dung" && useDate && !isNaN(useDate.getTime()) && useDate.getTime() >= start.getTime() && useDate.getTime() <= end.getTime()) {
            used += 1;
          }
        });
      } else {
        // Fallback if voucher_mua table is empty for this voucher:
        // Check if voucher active period overlaps [start, end]
        const vStart = v.tg_bat_dau_ban ? new Date(v.tg_bat_dau_ban) : v.ngay_tao ? new Date(v.ngay_tao) : new Date(0);
        const vEnd = v.tg_ket_thuc_ban ? new Date(v.tg_ket_thuc_ban) : new Date(Date.now() + 365 * 86400000);
        if (vStart.getTime() <= end.getTime() && vEnd.getTime() >= start.getTime()) {
          sold = Number(v.so_luong_da_ban) || 0;
          used = Number(v.so_luong_da_dung) || Number(v.so_luong_su_dung) || 0;
        }
      }

      const revenue = sold * giaBan;
      const usageRate = sold > 0 ? Math.round((used / sold) * 100) : 0;

      return {
        voucherId: v.ma_voucher,
        voucherName: v.ten_voucher,
        issued,
        sold,
        used,
        revenue,
        usageRate,
      };
    });

    const totalIssued = breakdown.reduce((s, b) => s + b.issued, 0);
    const totalSold = breakdown.reduce((s, b) => s + b.sold, 0);
    const totalUsed = breakdown.reduce((s, b) => s + b.used, 0);
    const totalRevenue = breakdown.reduce((s, b) => s + b.revenue, 0);
    const usageRate = totalSold > 0 ? Math.round((totalUsed / totalSold) * 100) : 0;

    // Helper for local timezone YYYY-MM-DD key
    const getLocalDayKey = (d) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Build daily sales map for chart from filtered date range
    const dailyMap = new Map();
    if (voucherMuaList.length > 0) {
      const voucherPriceMap = new Map();
      filtered.forEach((v) => {
        const price = Number(v.gia_ban) || (Number(v.gia_goc) - Number(v.gia_tri_giam || 0)) || 0;
        voucherPriceMap.set(v.ma_voucher, price);
      });

      voucherMuaList.forEach((m) => {
        const itemDateStr = m.thoi_gian_sinh_ma || m.ngay_su_dung;
        if (!itemDateStr) return;
        const d = new Date(itemDateStr);
        if (isNaN(d.getTime())) return;
        if (d.getTime() < start.getTime() || d.getTime() > end.getTime()) return;

        const dayKey = getLocalDayKey(d);
        const price = voucherPriceMap.get(m.ma_voucher) || 0;
        const cur = dailyMap.get(dayKey) || { revenue: 0, count: 0 };
        cur.revenue += price;
        cur.count += 1;
        dailyMap.set(dayKey, cur);
      });
    }

    // Build continuous daily timeline array from start to end (step 1 day)
    const daily = [];
    const monthlyMap = new Map();
    const yearlyMap = new Map();
    const curr = new Date(start);
    curr.setHours(0, 0, 0, 0);

    const endLimit = new Date(end);
    endLimit.setHours(23, 59, 59, 999);

    const diffDays = Math.max(1, Math.ceil((endLimit.getTime() - curr.getTime()) / 86400000));

    while (curr.getTime() <= endLimit.getTime()) {
      const dayKey = getLocalDayKey(curr);
      const dayLabel = `${String(curr.getDate()).padStart(2, "0")}/${String(curr.getMonth() + 1).padStart(2, "0")}`;
      const dayFullLabel = `${String(curr.getDate()).padStart(2, "0")}/${String(curr.getMonth() + 1).padStart(2, "0")}/${curr.getFullYear()}`;

      const salesOnDay = dailyMap.get(dayKey);
      let dayRevenue = salesOnDay ? salesOnDay.revenue : 0;
      let dayCount = salesOnDay ? salesOnDay.count : 0;

      // Fallback: If totalRevenue > 0 but no voucher_mua records in DB, distribute evenly across trend
      if (totalRevenue > 0 && dailyMap.size === 0) {
        dayRevenue = Math.round(totalRevenue / Math.max(1, diffDays));
      }

      daily.push({
        day: dayLabel,
        fullLabel: dayFullLabel,
        revenue: dayRevenue,
        count: dayCount,
      });

      // Monthly aggregation
      const monthKey = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, "0")}`;
      const monthLabel = `T${curr.getMonth() + 1}/${curr.getFullYear()}`;
      const curMonth = monthlyMap.get(monthKey) || { day: monthLabel, fullLabel: `Tháng ${curr.getMonth() + 1}/${curr.getFullYear()}`, revenue: 0, count: 0 };
      curMonth.revenue += dayRevenue;
      curMonth.count += dayCount;
      monthlyMap.set(monthKey, curMonth);

      // Yearly aggregation
      const yearKey = String(curr.getFullYear());
      const curYear = yearlyMap.get(yearKey) || { day: yearKey, fullLabel: `Năm ${yearKey}`, revenue: 0, count: 0 };
      curYear.revenue += dayRevenue;
      curYear.count += dayCount;
      yearlyMap.set(yearKey, curYear);

      curr.setDate(curr.getDate() + 1);
    }

    const monthly = Array.from(monthlyMap.values());
    const yearly = Array.from(yearlyMap.values());

    const lang = query.lang;
    if (lang && lang.toLowerCase().startsWith("en")) {
      for (const v of dropdownList) {
        if (v.ten_voucher) v.ten_voucher = await translationService.translateText(v.ten_voucher, "en");
      }
      for (const item of breakdown) {
        if (item.voucherName) item.voucherName = await translationService.translateText(item.voucherName, "en");
      }
    }

    return {
      vouchers: dropdownList,
      filteredData: breakdown,
      revenueTrend: daily,
      revenueTimeline: {
        daily,
        monthly,
        yearly,
      },
      totalIssued,
      totalSold,
      totalUsed,
      totalRevenue,
      usageRate,
      emptyReason: "none",
    };
  }
}

module.exports = new PartnerReportService();