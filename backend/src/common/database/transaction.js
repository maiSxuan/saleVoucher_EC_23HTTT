/**
 * Purpose: Wrapper transaction cho Supabase (PostgreSQL).
 *
 * Supabase JS client không hỗ trợ explicit BEGIN/COMMIT qua `.query()`.
 * Thay vào đó, dùng hai chiến lược:
 *
 * 1. withSupabaseTransaction(operations):
 *    - Thực hiện tuần tự các hàm `operations` (mảng async functions).
 *    - Nếu một bước thất bại → rollback thủ công (undo) các bước trước.
 *    - Phù hợp với thao tác INSERT/UPDATE đơn giản.
 *    - Mỗi operation: { execute: async (supabase) => ..., rollback: async (supabase) => ... }
 *
 * 2. withRpcTransaction(supabase, rpcName, params):
 *    - Gọi PostgreSQL stored procedure/function qua Supabase RPC.
 *    - Hàm SQL tự quản lý BEGIN/COMMIT/ROLLBACK.
 *    - Dùng cho thao tác phức tạp (phát hành mã, thanh toán...).
 */
const supabase = require('../../config/supabase');

/**
 * Thực hiện nhiều thao tác Supabase theo kiểu atomic (rollback thủ công).
 * @param {Array<{execute: Function, rollback: Function}>} operations
 * @returns {Promise<Array>} Kết quả của các bước thành công
 */
async function withSupabaseTransaction(operations) {
  const completed = [];

  for (const op of operations) {
    try {
      const result = await op.execute(supabase);
      completed.push({ op, result });
    } catch (error) {
      // Rollback theo thứ tự ngược
      for (const done of completed.reverse()) {
        if (done.op.rollback) {
          try {
            await done.op.rollback(supabase, done.result);
          } catch (rollbackErr) {
            console.error('[TRANSACTION] Rollback thất bại:', rollbackErr.message);
          }
        }
      }
      throw error;
    }
  }

  return completed.map((c) => c.result);
}

/**
 * Gọi Supabase RPC (PostgreSQL function) — hàm SQL tự quản lý transaction.
 * @param {string} rpcName - Tên function PostgreSQL
 * @param {object} params - Tham số truyền vào
 * @returns {Promise<any>}
 */
async function withRpcTransaction(rpcName, params = {}) {
  const { data, error } = await supabase.rpc(rpcName, params);
  if (error) {
    throw new Error(`[RPC Transaction] ${rpcName} thất bại: ${error.message}`);
  }
  return data;
}

module.exports = {
  withSupabaseTransaction,
  withRpcTransaction,
};
