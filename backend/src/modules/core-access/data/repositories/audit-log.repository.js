/**
 * Purpose: Repository cho bảng LOG_HT — ghi và đọc nhật ký hệ thống từ Supabase.
 * Chỉ thực hiện thao tác DB, không chứa business rule.
 */
const supabase = require("../../../../config/supabase");

class AuditLogRepository {
  /**
   * Ghi một bản ghi log vào bảng LOG_HT.
   * @param {object} logData
   *  - vai_tro_thuc_hien: string (JWT role)
   *  - hanh_dong: string (mô tả hành động, ví dụ: 'LOGIN', 'UPDATE_USER')
   *  - du_lieu_truoc: object|null (JSONB)
   *  - du_lieu_sau: object|null (JSONB)
   *  - ket_qua: 'Thanh cong' | 'That bai'
   *  - ly_do_thuc_hien: string|null
   *  - ma_tk_thuc_hien: uuid|null (FK TAIKHOAN)
   *  - doi_tuong: string|null (tên bảng/entity, ví dụ: 'NGUOIDUNG', 'VOUCHER')
   *  - ma_doi_tuong: uuid|null
   */
  async create(logData) {
    const { data, error } = await supabase
      .from("log_ht")
      .insert([
        {
          vai_tro_thuc_hien: logData.vai_tro_thuc_hien ?? null,
          hanh_dong: logData.hanh_dong,
          du_lieu_truoc: logData.du_lieu_truoc ?? null,
          du_lieu_sau: logData.du_lieu_sau ?? null,
          ket_qua: logData.ket_qua ?? null,
          ly_do_thuc_hien: logData.ly_do_thuc_hien ?? null,
          ma_tk_thuc_hien: logData.ma_tk_thuc_hien ?? null,
          doi_tuong: logData.doi_tuong ?? null,
          ma_doi_tuong: logData.ma_doi_tuong ?? null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[AuditLogRepository] Ghi log thất bại:", error.message);
      throw new Error(`Ghi audit log thất bại: ${error.message}`);
    }

    return data;
  }

  /**
   * Lấy danh sách log với bộ lọc và phân trang.
   * @param {object} query
   *  - page: số trang (bắt đầu từ 1)
   *  - limit: số bản ghi mỗi trang
   *  - maTkThucHien: uuid|null — lọc theo tài khoản thực hiện
   *  - doiTuong: string|null — lọc theo loại đối tượng
   *  - hanhDong: string|null — lọc theo hành động
   *  - ketQua: string|null — lọc theo kết quả
   *  - search: string|null — tìm trên hành động, đối tượng, vai trò, lý do và UUID
   */
  async list({
    page = 1,
    limit = 20,
    maTkThucHien,
    doiTuong,
    hanhDong,
    ketQua,
    search,
  } = {}) {
    const offset = (page - 1) * limit;

    let query = supabase
      .from("log_ht")
      .select(
        "log_id, vai_tro_thuc_hien, hanh_dong, ket_qua, ly_do_thuc_hien, thoi_diem_thuc_hien, ma_tk_thuc_hien, doi_tuong, ma_doi_tuong",
        { count: "exact" },
      )
      .order("thoi_diem_thuc_hien", { ascending: false })
      .range(offset, offset + limit - 1);

    if (maTkThucHien) query = query.eq("ma_tk_thuc_hien", maTkThucHien);
    if (doiTuong) query = query.eq("doi_tuong", doiTuong);
    if (hanhDong) query = query.ilike("hanh_dong", `%${hanhDong}%`);
    if (ketQua) query = query.eq("ket_qua", ketQua);

    const normalizedSearch = String(search || "")
      .trim()
      .slice(0, 100)
      .replace(/[^\p{L}\p{N}\s_-]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (normalizedSearch) {
      const pattern = `%${normalizedSearch}%`;
      const conditions = [
        `hanh_dong.ilike.${pattern}`,
        `doi_tuong.ilike.${pattern}`,
        `vai_tro_thuc_hien.ilike.${pattern}`,
        `ly_do_thuc_hien.ilike.${pattern}`,
        `ket_qua.ilike.${pattern}`,
      ];
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        .test(normalizedSearch);
      if (isUuid) {
        conditions.push(
          `log_id.eq.${normalizedSearch}`,
          `ma_tk_thuc_hien.eq.${normalizedSearch}`,
          `ma_doi_tuong.eq.${normalizedSearch}`,
        );
      }
      query = query.or(conditions.join(","));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("[AuditLogRepository] Đọc log thất bại:", error.message);
      throw new Error(`Đọc audit log thất bại: ${error.message}`);
    }

    return { logs: data, total: count };
  }

  /**
   * Lấy lý do từ chối mới nhất từ cột JSON du_lieu_sau của bảng log_ht theo doi_tuong và ma_doi_tuong
   */
  async getLatestRejectionReason(doiTuong, maDoiTuong) {
    if (!doiTuong || !maDoiTuong) return null;
    try {
      const upperTarget = String(doiTuong).toUpperCase();
      const lowerTarget = String(doiTuong).toLowerCase();

      const { data, error } = await supabase
        .from("log_ht")
        .select("ly_do_thuc_hien, du_lieu_sau, thoi_diem_thuc_hien")
        .or(`doi_tuong.eq.${upperTarget},doi_tuong.eq.${lowerTarget}`)
        .or(`ma_doi_tuong.eq.${maDoiTuong},du_lieu_sau->>ma_doi_tuong_goc.eq.${maDoiTuong}`)
        .or("hanh_dong.ilike.%REJECT%,hanh_dong.ilike.%TU_CHOI%")
        .order("thoi_diem_thuc_hien", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const reasonFromAfterJson = data.du_lieu_sau?.ly_do_tu_choi || data.du_lieu_sau?.ghi_chu_admin;
        const reasonFromText = data.ly_do_thuc_hien;
        return reasonFromAfterJson || reasonFromText || null;
      }
    } catch (e) {
      console.warn("[AuditLogRepository] getLatestRejectionReason warning:", e.message);
    }
    return null;
  }
}

module.exports = new AuditLogRepository();
